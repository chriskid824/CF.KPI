## Convenience

使用.NET5 + Angular 11 + NG-ZORRO開發，實現了很多基本功能，方便二次開發。

### 功能

實現了系统管理（用户，角色，菜單），組織管理（部門，職位），審批工作流，内容管理（文章，文件，字典等），代碼生成，日志工具等。

### 演示

地址：http://180.163.89.224:8888/

帳號：admin1~admin9

密碼：同帳號

### 開發环境

vs + vs code

### 本地運行

Convience.Web\Managent是web端

Convience.Backend是api端

### 本地運行（docker）

cd到src目錄執行docker-compose up -d --build

然後訪問localhost:8888

### 創建項目模板（後端）

cd到src\Convience.Backend目錄，執行[dotnet new -i .]，這樣就創建了一個convience名稱的模板（名稱可以在template.json中修改）。然後通過[dotnet new convience -n 項目名]可以創建新項目，新項目的命名空間會被修改為剛才指定的項目名。

### 重要变更

2021/03/13  api从net core3.1 升级到 .net5