## Convenience

使用.NET5 + Angular 11 + NG-ZORRO開發，實現了很多基本功能，方便二次開發。

### 功能

實現了系统管理（用户，角色，菜單），組織管理（部門，職位），審批工作流，内容管理（文章，文件，字典等），代碼生成，日志工具等。

### 演示

地址：http://10.1.1.26/

帳號：同BPM帳號

密碼：同BPM密碼

### 開發环境

vs + vs code

### 本地運行
第一次下載請執行 npm install 安裝package

Convience.Web\Managent是web端

Convience.Backend是api端

### 本地運行（docker）

Visual2019開啟Convience.Backend\Convience.sln直接運行

cd到src\Convience.Web\Managent目錄執行ng serve

然後訪問localhost:4200

### 重要变更

2021/03/13  api从net core3.1 升级到 .net5