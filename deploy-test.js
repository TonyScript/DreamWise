#!/usr/bin/env node

/**
 * Deployment Test Script for Dream Interpretation Platform
 * Tests static hosting compatibility and performance optimizations
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Dream Interpretation Platform - Deployment Test\n');

// Test results
let testResults = {
    passed: 0,
    failed: 0,
    warnings: 0
};

function logTest(name, status, message = '') {
    const statusIcon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
    console.log(`${statusIcon} ${name}${message ? ': ' + message : ''}`);
    
    if (status === 'pass') testResults.passed++;
    else if (status === 'fail') testResults.failed++;
    else testResults.warnings++;
}

// Test 1: Check if minified files exist
console.log('📦 Testing Minified Assets...');
const minifiedFiles = [
    'assets/css/main.min.css',
    'assets/js/main.min.js',
    'assets/js/navigation.min.js',
    'assets/js/faith-switcher.min.js'
];

minifiedFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        const sizeKB = (stats.size / 1024).toFixed(2);
        logTest(`Minified file exists: ${file}`, 'pass', `${sizeKB} KB`);
    } else {
        logTest(`Minified file missing: ${file}`, 'fail');
    }
});

// Test 2: Check HTML files use minified assets
console.log('\n🔗 Testing HTML Asset References...');
const htmlFiles = [
    'index.html',
    'browse.html',
    'categories.html',
    'insights.html',
    'dream/snake.html',
    'dream/water.html'
];

htmlFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for minified CSS
        if (content.includes('main.min.css')) {
            logTest(`${file} uses minified CSS`, 'pass');
        } else if (content.includes('main.css')) {
            logTest(`${file} uses non-minified CSS`, 'warn');
        }
        
        // Check for minified JS
        if (content.includes('main.min.js')) {
            logTest(`${file} uses minified JS`, 'pass');
        } else if (content.includes('main.js')) {
            logTest(`${file} uses non-minified JS`, 'warn');
        }
    }
});

// Test 3: Check for absolute paths that could break static hosting
console.log('\n🌐 Testing Static Hosting Compatibility...');
htmlFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for problematic absolute paths (excluding external URLs and meta tags)
        const problematicPaths = content.match(/(?:href|src)=["'][\/][^"']*["']/g);
        const filteredPaths = problematicPaths ? problematicPaths.filter(path => 
            !path.includes('http') && 
            !path.includes('assets/images/favicon') &&
            !path.includes('assets/images/apple-touch-icon') &&
            !path.includes('assets/images/og-') &&
            !path.includes('assets/images/twitter-') &&
            !path.includes('assets/images/symbols/') &&
            !path.includes('assets/images/logo.png')
        ) : [];
        
        if (filteredPaths.length === 0) {
            logTest(`${file} has no problematic absolute paths`, 'pass');
        } else {
            logTest(`${file} has absolute paths`, 'fail', filteredPaths.join(', '));
        }
    }
});

// Test 4: Check file sizes for performance
console.log('\n📊 Testing File Sizes...');
const performanceFiles = [
    { file: 'assets/css/main.min.css', maxSize: 100 }, // 100KB max
    { file: 'assets/js/main.min.js', maxSize: 150 },   // 150KB max
    { file: 'index.html', maxSize: 200 }               // 200KB max
];

performanceFiles.forEach(({ file, maxSize }) => {
    if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        const sizeKB = stats.size / 1024;
        
        if (sizeKB <= maxSize) {
            logTest(`${file} size OK`, 'pass', `${sizeKB.toFixed(2)} KB`);
        } else {
            logTest(`${file} size large`, 'warn', `${sizeKB.toFixed(2)} KB (max: ${maxSize} KB)`);
        }
    }
});

// Test 5: Check essential files exist
console.log('\n📁 Testing Essential Files...');
const essentialFiles = [
    'index.html',
    'browse.html',
    'categories.html',
    'insights.html',
    'sitemap.xml',
    'robots.txt',
    'assets/css/main.min.css',
    'assets/js/main.min.js'
];

essentialFiles.forEach(file => {
    if (fs.existsSync(file)) {
        logTest(`Essential file exists: ${file}`, 'pass');
    } else {
        logTest(`Essential file missing: ${file}`, 'fail');
    }
});

// Test 6: Check dream interpretation pages
console.log('\n🌙 Testing Dream Pages...');
const dreamFiles = fs.readdirSync('dream').filter(file => file.endsWith('.html'));
dreamFiles.forEach(file => {
    const fullPath = path.join('dream', file);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check for faith switcher functionality
    if (content.includes('faith-tab') && content.includes('faith-content')) {
        logTest(`${file} has faith switcher`, 'pass');
    } else {
        logTest(`${file} missing faith switcher`, 'fail');
    }
    
    // Check for relative paths in dream folder
    if (content.includes('../assets/')) {
        logTest(`${file} uses correct relative paths`, 'pass');
    } else {
        logTest(`${file} path issues`, 'warn');
    }
});

// Test 7: Deployment Platform Compatibility
console.log('\n🚀 Testing Deployment Compatibility...');

// Check for common deployment issues
const deploymentChecks = [
    {
        name: 'No server-side dependencies',
        test: () => !fs.existsSync('package.json') || !JSON.parse(fs.readFileSync('package.json', 'utf8')).dependencies,
        message: 'Static hosting compatible'
    },
    {
        name: 'Index file exists',
        test: () => fs.existsSync('index.html'),
        message: 'Entry point available'
    },
    {
        name: 'Assets folder structure',
        test: () => fs.existsSync('assets') && fs.existsSync('assets/css') && fs.existsSync('assets/js'),
        message: 'Proper asset organization'
    }
];

deploymentChecks.forEach(({ name, test, message }) => {
    if (test()) {
        logTest(name, 'pass', message);
    } else {
        logTest(name, 'fail', message);
    }
});

// Summary
console.log('\n📋 Test Summary');
console.log('================');
console.log(`✅ Passed: ${testResults.passed}`);
console.log(`⚠️  Warnings: ${testResults.warnings}`);
console.log(`❌ Failed: ${testResults.failed}`);

if (testResults.failed === 0) {
    console.log('\n🎉 All critical tests passed! Ready for deployment.');
    console.log('\n🌐 Deployment Instructions:');
    console.log('1. Upload all files to your static hosting provider');
    console.log('2. Ensure index.html is set as the default page');
    console.log('3. Configure 404 redirects if needed');
    console.log('\n✅ Compatible with: Vercel, Netlify, GitHub Pages, AWS S3, etc.');
} else {
    console.log('\n⚠️  Some tests failed. Please fix issues before deployment.');
    process.exit(1);
}