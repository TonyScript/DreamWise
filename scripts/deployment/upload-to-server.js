const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 配置信息 - 请根据您的服务器信息修改
const config = {
  host: 'your-server-hostname', // 例如: example.com 或 123.456.789.0
  username: 'your-username',    // 您的SSH用户名
  remotePath: '/path/to/webroot', // 服务器上的网站根目录
  localZipPath: path.join('deployment', 'dreamwise-deployment.zip'), // 本地ZIP文件路径
  tempRemotePath: '/tmp/dreamwise-deployment.zip' // 服务器上的临时路径
};

// 检查ZIP文件是否存在
if (!fs.existsSync(config.localZipPath)) {
  console.error(`错误: 找不到部署文件 ${config.localZipPath}`);
  console.error('请先运行 "node prepare-deployment.js" 创建部署文件');
  process.exit(1);
}

console.log('开始上传文件到服务器...');

// 使用SCP上传文件
const scpCommand = `scp ${config.localZipPath} ${config.username}@${config.host}:${config.tempRemotePath}`;

exec(scpCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`上传失败: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`警告: ${stderr}`);
  }
  
  console.log('文件上传成功，正在解压...');
  
  // 使用SSH连接到服务器并解压文件
  const sshCommand = `ssh ${config.username}@${config.host} "mkdir -p ${config.remotePath} && unzip -o ${config.tempRemotePath} -d ${config.remotePath} && rm ${config.tempRemotePath} && echo '部署完成'"`;
  
  exec(sshCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`部署失败: ${error.message}`);
      return;
    }
    
    console.log('部署输出:');
    console.log(stdout);
    
    if (stderr) {
      console.error(`警告: ${stderr}`);
    }
    
    console.log('部署完成！');
    console.log(`网站应该已经可以在 http://${config.host} 访问了`);
  });
});

// 注意: 此脚本需要在您的系统上安装了ssh和scp命令，并且已经配置了SSH密钥认证
// 如果您使用密码认证，将会提示您输入密码