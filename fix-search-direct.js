/**
 * 直接修复index-new.html搜索功能
 * 使用更简单直接的方法，解决Chrome和Firefox兼容性问题
 */

const fs = require('fs');

// 读取文件
console.log('读取index-new.html文件...');
let content = fs.readFileSync('index-new.html', 'utf8');

// 1. 添加内联搜索脚本到body结束标签前
console.log('添加内联搜索脚本...');
const searchScript = `
<script>
// 直接的搜索功能实现 - 修复版本
window.onload = function() {
  console.log('搜索脚本已加载 - 修复版本');
  
  // 搜索按钮点击事件
  var searchToggle = document.getElementById('search-toggle');
  if (searchToggle) {
    searchToggle.onclick = function(e) {
      e.preventDefault();
      console.log('搜索按钮被点击');
      var searchBar = document.getElementById('search-bar');
      if (searchBar) {
        searchBar.classList.toggle('hidden');
        
        if (!searchBar.classList.contains('hidden')) {
          var searchInput = document.querySelector('#search-bar input');
          if (searchInput) {
            searchInput.focus();
          }
        }
      } else {
        console.error('搜索栏未找到');
      }
    };
  } else {
    console.error('搜索按钮未找到');
  }
  
  // 搜索提交按钮点击事件
  var searchButton = document.querySelector('#search-bar button');
  if (searchButton) {
    searchButton.onclick = function(e) {
      e.preventDefault();
      var searchInput = document.querySelector('#search-bar input');
      if (searchInput) {
        var query = searchInput.value.trim();
        if (query) {
          console.log('执行搜索:', query);
          window.location.href = 'browse.html?search=' + encodeURIComponent(query);
        }
      }
    };
  }
  
  // 搜索框Enter键事件
  var searchInput = document.querySelector('#search-bar input');
  if (searchInput) {
    searchInput.onkeypress = function(e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        var query = this.value.trim();
        if (query) {
          console.log('执行搜索 (Enter):', query);
          window.location.href = 'browse.html?search=' + encodeURIComponent(query);
        }
      }
    };
  }
  
  // 移动端搜索
  var mobileSearchInput = document.querySelector('.mobile-menu .relative input');
  if (mobileSearchInput) {
    // 添加移动端搜索按钮
    var mobileSearchButton = document.createElement('button');
    mobileSearchButton.className = 'absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-purple-400 hover:text-purple-300';
    mobileSearchButton.textContent = 'Search';
    mobileSearchInput.parentNode.appendChild(mobileSearchButton);
    
    // 移动端搜索按钮点击事件
    mobileSearchButton.onclick = function(e) {
      e.preventDefault();
      var query = mobileSearchInput.value.trim();
      if (query) {
        console.log('执行移动端搜索:', query);
        window.location.href = 'browse.html?search=' + encodeURIComponent(query);
      }
    };
    
    // 移动端搜索框Enter键事件
    mobileSearchInput.onkeypress = function(e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        var query = this.value.trim();
        if (query) {
          console.log('执行移动端搜索 (Enter):', query);
          window.location.href = 'browse.html?search=' + encodeURIComponent(query);
        }
      }
    };
  }
};
</script>
`;

// 在</body>前插入脚本
content = content.replace('</body>', searchScript + '</body>');

// 2. 确保搜索按钮有正确的ID
console.log('确保搜索按钮有正确的ID...');
if (!content.includes('id="search-toggle"')) {
  content = content.replace(
    '<button class="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors duration-300 text-gray-300 hover:text-white"',
    '<button id="search-toggle" class="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors duration-300 text-gray-300 hover:text-white"'
  );
}

// 3. 确保搜索栏有正确的ID
console.log('确保搜索栏有正确的ID...');
if (!content.includes('id="search-bar"')) {
  content = content.replace(
    '<div class="hidden mt-4 pb-4">',
    '<div id="search-bar" class="hidden mt-4 pb-4">'
  );
}

// 保存修改后的文件
console.log('保存修改后的文件...');
fs.writeFileSync('index-new.html', content, 'utf8');

console.log('✅ 搜索功能修复完成！');

// 现在创建browse.html的搜索处理脚本
console.log('\n开始修复browse.html的搜索功能...');

try {
  // 读取browse.html文件
  let browseContent = fs.readFileSync('browse.html', 'utf8');
  
  // 添加搜索处理脚本
  const browseSearchScript = `
<script>
// 处理URL参数中的搜索查询
window.onload = function() {
  // 获取URL参数
  function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\\+/g, ' '));
  }
  
  // 获取搜索查询
  var searchQuery = getUrlParameter('search');
  if (searchQuery) {
    console.log('检测到搜索查询:', searchQuery);
    
    // 显示搜索结果标题
    var resultsTitle = document.createElement('h2');
    resultsTitle.className = 'text-2xl font-bold mb-6 text-center text-white';
    resultsTitle.innerHTML = 'Search Results for: <span class="text-purple-400">' + searchQuery + '</span>';
    
    // 插入到页面中
    var mainContent = document.querySelector('.container.mx-auto.px-6');
    if (mainContent) {
      mainContent.insertBefore(resultsTitle, mainContent.firstChild);
    }
    
    // 过滤梦境符号卡片
    var allCards = document.querySelectorAll('.dream-card');
    var matchCount = 0;
    
    allCards.forEach(function(card) {
      var cardTitle = card.querySelector('h3').textContent.toLowerCase();
      var cardDesc = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';
      
      if (cardTitle.includes(searchQuery.toLowerCase()) || cardDesc.includes(searchQuery.toLowerCase())) {
        card.style.display = 'block';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    // 显示结果计数
    var resultCount = document.createElement('p');
    resultCount.className = 'text-center text-gray-400 mb-8';
    resultCount.textContent = matchCount + ' results found';
    
    if (mainContent) {
      mainContent.insertBefore(resultCount, mainContent.firstChild.nextSibling);
    }
    
    // 如果没有结果，显示提示
    if (matchCount === 0) {
      var noResults = document.createElement('div');
      noResults.className = 'glass-card p-8 text-center';
      noResults.innerHTML = '<p class="text-xl text-gray-300 mb-4">No dream symbols found matching "' + searchQuery + '"</p>' +
                           '<p class="text-gray-400">Try a different search term or <a href="browse.html" class="text-purple-400 hover:text-purple-300">browse all symbols</a>.</p>';
      
      if (mainContent) {
        mainContent.appendChild(noResults);
      }
    }
  }
};
</script>
  `;
  
  // 在</body>前插入脚本
  browseContent = browseContent.replace('</body>', browseSearchScript + '</body>');
  
  // 保存修改后的文件
  fs.writeFileSync('browse.html', browseContent, 'utf8');
  console.log('✅ browse.html搜索功能修复完成！');
} catch (error) {
  console.error('修复browse.html时出错:', error);
}