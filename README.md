# GRAPHQL DEMO

## DEMO简介

- 原型：Demo改编自angular官方文档的英雄编辑器。

- 后端：使用Nest.js,以及Nest内部集成的typeOrm模块（@nestjs/typeorm）和graphql(包装了apollo server)模块（@nestjs/graphql）。

- 前端：使用angular.js以及angular内部集成的apollo模块(apollo-angular)和graphql-tag模块

> apollo server的功能相当于express/koa，不同的是后者使用restful api，前者使用graphql。

> 前后端建立的详细过程，思路，以及相关文档请查看另两个md文档

## GraphQl原理概述

- [graphQl中文文档](https://graphql.cn/learn/)

### GraphQl是什么？为什么要使用GraphQl?

- 根据官网的解释,GraphQl就是一种用于 API 的查询语言。

> 换句话说：ask exactly what you want.

- GraphQl是Facebook 在2012年开发的，2015年开源，2016年下半年Facebook宣布可以在生产环境使用，而其内部早就已经广泛应用了，用于替代 REST API。它的开发动机有一句英文说得很好，原文找不到了，大意就是：JS程序员试图用json来描述api，于是诞生了GraphQl。

- 当我们想要获取服务器上的资源时，比如全部英雄的ID,使用graphql，可以这么定义：

  ```bash
  query{
      getHeroes{
          id
      }
  }
  ```
  
  当我们改变需求了，还要再获取英雄的name，只需要改动一处。

  ```bash
  query{
      getHeroes{
          id,
          name
      }
  }
  ```

  后端可以完全不变。而使用restful api，解决方案要么是沟通后端人员，要求加一个api，或者修改当前api，或者一开始就写好了，不管你要什么，我把所有的数据，id,name等等其他字段，全发给前端，需要什么自己去response里找。沟通后端人员，增加交流成本，影响进度，增加api或者修改api，增加后端人员工作量，同样影响进度，而一开始就返回所有数据，让前端自己取需要的数据，则产生了很多不必要的宽带开销，比如一位Hero有20多个字段，前端只需要一个name字段，后端一口气返回20多个字段，不仅慢，还浪费大量网络资源。使用graphql的话，前端需要什么样的api，就可以自己去定义，你需要什么数据，后端返回什么数据，即不需要去麻烦后端开发人员，也不会产生不必要的网络开销。

- graphql比起restful api更加方便管理和学习，后端即使使用swagger管理restful api，也是治标不治本,api文档读起来太蛋疼。
  
- 要学习graphql来自定义api，可以打开graphql的playground,类似于swagger页面，位于服务器域名的/graphql路径下,例如：`http://localhost:3000/graphql`
  
    ![playground](https://work.mafengshe.com/static/upload/article/pic1574167818005.jpg)
  
- 上图是playground界面，左边自定义查询模式，右边是后端返回的结果。点击右边SCHEME标签会显示后端对所有资源的描述，在后端交由type-graphql模块自动生成，graphql scheme是graphql自定义的模式定义语言，详见graphql文档。点击右边DOCS标签会显示后端可提供的服务(Query:查询，Mutation:改变，包括增删改)，以及前端需要提供的参数，可获取的数据，数据的类型，还有后端开发人员对这些字段和服务添加的注释。另可以通过上面的搜索栏搜索需要的内容。
  
    ![SCHEMA](https://work.mafengshe.com/static/upload/article/pic1574168512961.jpg)
    ![DOCS](https://work.mafengshe.com/static/upload/article/pic1574168519042.jpg)

>具体该如何定义查询模式，自行查阅graphql文档。
