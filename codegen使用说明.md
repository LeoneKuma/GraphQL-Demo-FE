# Codegen使用说明

## Codegen简介

- codegen全称graphql code generator,使用时通常通过@graphql-codegen/cli脚手架。
- codegen作用是将后台的schema转换成具体的,用ts描述的类型，使用codegen可以同步更新后端所使用到的对象类型。
- 文档地址：<https://graphql-code-generator.com/docs/getting-started/>

## Getting Started

1. 安装依赖

   - 首先确保安装了graphql:`cnpm i --save graphql`
   - 接着安装脚手架CLI:`cnpm i --save @graphql-code/cli`
   - 最后安装一个之后用到的插件:`cnpm i --save @graphql-codegen/typescript`

2. 由于CLI不是全局安装，所以在package.json处添加script确保能运行:`"init":"graphql-codegen init"`

3. 运行上面添加的指令，使用CLI进行codegen的配置初始化
   `npm run init`
   依次选择如下配置:
     1. application built with angular
     2. 后端schema所在位置，eg:<http://localhost:3000/graphql>
     3. 用不到的配置，这里直接enter选默认，之后要在配置文件中删除这条
     4. 选择插件，只选择一个:TypeScript (required by other typescript plugins)，但是这个配置会出现问题，之后需要删除。
     5. 选择输出文件的目录和文件名，eg:src/app/api-gql/output.ts
     6. N
     7. 配置文件的命名，选默认
     8. 选择运行转换功能，输出ts文件的srcipt名称,eg:parsegql

4. 删除package.json文件中，在init过程中生成的依赖 "@graphql-codegen/typescript": "0.0.0"
5. 删除codegen.yml配置文件中的documents: "src/**/*.graphql"

6. 确保后端schema能正常访问，例如后端demo的schema地址是<http://localhost:3000/graphql>,之后运行脚本
npm run parsegql,成功的话，可以在src/app/api-gql/output.ts中找到后端graphql schema对应的ts对象类型，使用时自行导入。
