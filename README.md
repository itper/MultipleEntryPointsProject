
项目功能
-----

重构


### 实现多入口的项目打包

从去年开始,我们考虑将原有的基于grunt开发环境进行重新开发,以支持最新的前端开发框架,该项目也是根据我们实际项目中的需求分析,基于webpack的二次实现.

### 主要解决问题

- 提取多入口bundle中的公共文件.
- 通过hash命名文件,做缓存.
- 



初始化

>推荐node version>4.2.0

>npm install
>
>



构建dll库
>./build/dev_cli.js buildDll


构建所有入口
>./build/dev_cli.js buildAll


构建指定的入口
>./build/dev_cli.js build --target [entry]
>
>./build/dev_cli.js build --target app/index

支持热替换react的开发服务.
>./build/dev_cli.js dev --target [entry]

添加入口
>./build/dev_cli.js create [dir]

>以上命令都不会主动重新构建dll,可执行以下命令
>
>./build/dev_cli.js buildDll && ./build/dev_cli.js buid --target app/index

##CNPM

安装

>npm install -g cnpm --registry=https://registry.npm.taobao.org

registry url

[http://10.252.137.119:7001](http://10.252.137.119:7001)

安装依赖

>
cnpm install --save hello --registry=http://10.252.137.119:7001

设置registry地址.

>
cnpm set registry http://10.252.137.119:7001

web

[http://10.252.137.119:7001](http://10.252.137.119:7002)

发布

> cnpm login

> cnpm publish


资讯
-------

./build/dev_cli.js buildDll

./build/dev_cli.js dev --target information/src/index


服务端渲染
-----

以information为例

1. 构建入口文件

	`./builder/dev_cli.js build --target information/index`
	./builder/dev_cli.js buildDll

	
2. 构建serverDll文件

	`./builder/dev_cli.js buildServerDll`

	`./build/erdev_cli.js buildServer --target server`

3. 	
	`node ./dist/server`
	
