/**
 * 修复browse.html搜索功能
 * 
 * 解决问题:
 * 1. 搜索不能正确找到"car"等梦象
 * 2. 搜索结果显示混乱
 */

const fs = require('fs');
const path = require('path');

console.log('开始修复browse.html搜索功能...');

try {
  // 读取browse.html文件
  let browseContent = fs.readFileSync('browse.html', 'utf8');
  
  // 添加搜索处理脚本
  const browseSearchScript = `
<script>
// 增强的搜索功能 - 修复版本
window.addEventListener('DOMContentLoaded', function() {
  console.log('搜索处理脚本已加载');
  
  // 获取URL参数
  function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\\\[').replace(/[]]/, '\\\\]');
    var regex = new RegExp('[\\\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\\\\+/g, ' '));
  }
  
  // 获取搜索查询
  var searchQuery = getUrlParameter('search');
  if (searchQuery) {
    console.log('检测到搜索查询:', searchQuery);
    searchQuery = searchQuery.toLowerCase();
    
    // 创建搜索结果容器
    var searchResultsContainer = document.createElement('div');
    searchResultsContainer.className = 'container mx-auto px-6 py-8';
    
    // 添加搜索结果标题
    var resultsTitle = document.createElement('h2');
    resultsTitle.className = 'text-3xl font-bold mb-6 text-center text-white';
    resultsTitle.innerHTML = 'Search Results for: <span class="text-purple-400">' + searchQuery + '</span>';
    searchResultsContainer.appendChild(resultsTitle);
    
    // 查找所有梦象卡片
    var allCards = document.querySelectorAll('.dream-symbol-card');
    console.log('找到梦象卡片数量:', allCards.length);
    
    var matchingCards = [];
    
    // 遍历所有卡片查找匹配项
    allCards.forEach(function(card) {
      var cardTitle = card.querySelector('h3').textContent.toLowerCase();
      var cardDesc = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';
      
      console.log('检查卡片:', cardTitle);
      
      // 检查标题或描述是否包含搜索词
      if (cardTitle.includes(searchQuery) || cardDesc.includes(searchQuery)) {
        console.log('找到匹配:', cardTitle);
        matchingCards.push(card.cloneNode(true));
      }
    });
    
    // 显示结果计数
    var resultCount = document.createElement('p');
    resultCount.className = 'text-center text-gray-400 mb-8';
    resultCount.textContent = matchingCards.length + ' results found';
    searchResultsContainer.appendChild(resultCount);
    
    // 创建结果网格
    if (matchingCards.length > 0) {
      var resultsGrid = document.createElement('div');
      resultsGrid.className = 'grid grid-cols-2 md:grid-cols-4 gap-4';
      
      // 添加匹配的卡片到网格
      matchingCards.forEach(function(card) {
        resultsGrid.appendChild(card);
      });
      
      searchResultsContainer.appendChild(resultsGrid);
    } else {
      // 如果没有结果，显示提示
      var noResults = document.createElement('div');
      noResults.className = 'glass-card p-8 text-center';
      noResults.innerHTML = '<p class="text-xl text-gray-300 mb-4">No dream symbols found matching "' + searchQuery + '"</p>' +
                           '<p class="text-gray-400">Try a different search term or <a href="browse.html" class="text-purple-400 hover:text-purple-300">browse all symbols</a>.</p>';
      
      searchResultsContainer.appendChild(noResults);
    }
    
    // 添加返回按钮
    var backButton = document.createElement('div');
    backButton.className = 'text-center mt-8';
    backButton.innerHTML = '<a href="browse.html" class="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300"><i class="fas fa-arrow-left mr-2"></i> Back to All Symbols</a>';
    searchResultsContainer.appendChild(backButton);
    
    // 隐藏原始内容并插入搜索结果
    var mainContent = document.querySelector('main');
    if (mainContent) {
      // 保存字母导航
      var letterNav = document.querySelector('.letter-navigation');
      
      // 清空主内容
      mainContent.innerHTML = '';
      
      // 添加搜索结果
      mainContent.appendChild(searchResultsContainer);
      
      // 重新添加字母导航
      if (letterNav) {
        mainContent.appendChild(letterNav);
      }
      
      // 滚动到顶部
      window.scrollTo(0, 0);
    } else {
      console.error('未找到主内容容器');
    }
  }
});
</script>
  `;
  
  // 移除可能存在的旧搜索脚本
  browseContent = browseContent.replace(/<script>[\s\S]*?window\.onload[\s\S]*?<\/script>/g, '');
  
  // 在</body>前插入脚本
  browseContent = browseContent.replace('</body>', browseSearchScript + '</body>');
  
  // 保存修改后的文件
  fs.writeFileSync('browse.html', browseContent, 'utf8');
  console.log('✅ browse.html搜索功能修复完成！');
} catch (error) {
  console.error('修复browse.html时出错:', error);
}