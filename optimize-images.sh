#!/bin/bash

# 图像优化脚本
# 需要安装: npm install -g sharp-cli

echo "开始优化图像..."

# 创建优化后的图像目录
mkdir -p assets/images/optimized

# 优化 JPG/JPEG 图像
find assets/images -type f \( -name "*.jpg" -o -name "*.jpeg" \) -print0 | while IFS= read -r -d '' file; do
  filename=$(basename "$file")
  echo "优化 JPEG: $filename"
  sharp "$file" -o "assets/images/optimized/$filename" --quality 80
done

# 优化 PNG 图像
find assets/images -type f -name "*.png" -print0 | while IFS= read -r -d '' file; do
  filename=$(basename "$file")
  echo "优化 PNG: $filename"
  sharp "$file" -o "assets/images/optimized/$filename" --quality 80
done

# 将 PNG 转换为 WebP
find assets/images -type f -name "*.png" -print0 | while IFS= read -r -d '' file; do
  filename=$(basename "$file" .png)
  echo "转换为 WebP: $filename.webp"
  sharp "$file" -o "assets/images/optimized/$filename.webp" --webp
done

# 将 JPG 转换为 WebP
find assets/images -type f \( -name "*.jpg" -o -name "*.jpeg" \) -print0 | while IFS= read -r -d '' file; do
  filename=$(basename "$file" | sed 's/\.[^.]*$//')
  echo "转换为 WebP: $filename.webp"
  sharp "$file" -o "assets/images/optimized/$filename.webp" --webp
done

echo "图像优化完成"
