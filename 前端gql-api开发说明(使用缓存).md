# 前端gql-api开发说明

## 缓存配置说明

- 在graphql.module.ts文件的createApollo方法中，返回对象的cache字段,指定了cache的类型，这里使用apollo自带的InMemoryCache,调用该类的构造函数，该构造函数接受一个对象，使用该对象进行一些配置，包括如何为一些实体对象，例如User，指定唯一标识符，默认是使用id字段结合类型(__typename)，后端所有实体类都使用id作为主键，而__typename交由codegen自动生成，所以这里可以无需进行任何配置。

  ```ts
  // graphql.module.ts文件
  const uri = 'http://localhost:3000/graphql'; // <-- add the URL of the GraphQL server here
  export function createApollo(httpLink: HttpLink) {
    return {
      link: httpLink.create({uri}),
      cache: new InMemoryCache()
    };
  }
  ```

## 如何通过自动生成的后端api类型书写gql schema

- 关于如何自动生成后端api类型，参考codegen使用说明.md文件

- 自动生成的后端api类型，顾名思义，仅仅是一个类型，不要当做类使用，new不了。同时要注意，生成的后端api对象类型，对graphql内部的Float和Int类型进行了包装，都变成了number类型，使用时要注意区分number对应的到底是整数还是浮点数。

- 书写一个gql schema如下:写的时候不需要导入HeroDetailInput类型，实际用这个类型去声明一些变量的时候，再去导入这个类型就行。自动生成的后端api类型仅用于在ts中定义变量时进行类型检测，以符合graphql对参数的要求。

  ```ts
  export const UPDATE_HERO = gql`
  mutation ($heroDetail:HeroDetailInput!){
      updateHeroB(heroDetail:$heroDetail)
  }
  `
  ```

  ```ts
  // hero-detail.component.ts文件
  import { HeroDetailInput } from './api-gql/output'
  const heroDetail: HeroDetailInput = { id: this.hero.id, name: this.hero.name, description: this.hero.description };
  ```

## 如何使用写好的schema去向服务器发送Query和Mutation请求

- 向后台发请求的方法定义在service类中，所以在service类的构造函数中通过依赖注入获取apollo cilent对象，随后使用这个对象向后台发请求。

  ```ts
  // hero.service.ts文件
  import { Apollo } from 'apollo-angular';
   constructor(
      private apollo: Apollo
    ) { }
  ```

- Query的schema

  ```ts
  export const GET_HEROES = gql`
  query getHeroes{
      getHeroes{
        id,
        name,
        description
      }
    }
  `
  ```
  
- 因为使用到cache的原因,不再使用query方法，而是使用watchQuery方法。其中fetchPolicy字段为可选字段，不设置该字段则默认使用cache，fetchPolicy字段常使用以下两个可选项，'no-cache'或'network-only'，'network-only'意味着发query请求时，不看cache里有没有数据，而是一定会发请求从后端获取最新的数据，获取到数据后，还会将这些数据写入cache，'no-cache'意味着不仅发请求时不确认cache，获取到数据后，也不会将数据写入cache,不设置该字段时，意味着cache first策略,若cache中有数据，则不向后端请求，第一次请求时，也会将请求的数据放入cache。如果下面的GET_HEROES不设置fetchPolicy，则我们在子路由不停切换时，不会向服务器发请求最新数据。

  ```ts
  import { GET_HEROES } from './api-gql/hero/hero.gql'
  getHeroes(): Observable<any> {
    return this.apollo.watchQuery(
      {
        query: GET_HEROES,
        fetchPolicy: 'network-only',
      }).valueChanges.pipe(map<any,any>(({data}) => data.getHeroes));
  }
  ```

- valueChanges属性是一个Observable对象，这个对象中包含我们需要的数据，在这个对象上使用过滤器pipe,pipe中再使用map，可以将我们需要的数据从后端返回结果的具体某个字段上截取出来。也可以不在这里使用pipe，而是在模板中使用select过滤器，效果是一样的。

  ```ts
  // dashboard.component.ts文件中
  heroes: Observable<any>;
  this.heroes=this.heroService.getHeroes()
  ```

  ```html
  <!--  dashboard.component.html文件中 -->
  <!--  service类方法使用pipe时 -->
    <a *ngFor="let hero of heroes|async"
        routerLink="/detail/{{hero.id}}">
      <div class="module hero">
        <h4>{{hero.name}}</h4>
      </div>
    </a>
  <!--  service类方法不使用pipe时 -->
  <a *ngFor="let hero of heroes|async|select:'getHeroes'"
      routerLink="/detail/{{hero.id}}">
    <div class="module hero">
      <h4>{{hero.name}}</h4>
    </div>
  </a>
  ```

- watchQuery()方法返回的是一个包装过的Observable对象，上面说到的valueChanges属性是这个对象的成员变量之一。apollo将这个包装过的Observable对象命名为QueryRef,即QueryRefetch。顾名思义，valueChanges一定和值的变化有关。事实上，这个值指的是cache,当我们的mutation操作改变了cache中的对象时,valueChanges属性内的值，也会随之变化，也就是说，这个变量是响应式的，这也是为什么废弃query,使用watchQuery的原因，query是一次性的，获取的结果不具备响应式的功能，而watchQuery会监视cache。我们通过*ngFor指令展示了一个英雄列表，当我们在其他路径修改了这个列表中某个英雄的名字时，返回英雄列表所在的路径时，对应的英雄名称也会发生变化，英雄列表的维护交由cache完成，我们不需要自己手动地维护一个像是 const heroes:Hero[]这样的数组变量，在每次增删改的时候，对这个数组最一些操作。当然，我们也可以直接访问cache，对其中的内容进行维护，就像对上面说的heroes这个数组一样。

- Mutation的Schema

  ```ts
  `
  export const UPDATE_HERO = gql`
  mutation ($heroDetail:HeroDetailInput!){
      updateHero(heroDetail:$heroDetail)
  }
  `
  ```

- 使用上述schema向服务器发送一次mutation请求。

  ```ts
  async updateHero(heroDetail: HeroDetailInput): Promise<boolean> {
      var res = await this.apollo.mutate<any>(
        {
          mutation: UPDATE_HERO,
          variables: {
            heroDetail: heroDetail
          }
        }
      ).toPromise();
      return res.data.updateHero;
    }
  ```

- 后端返回的结果包含了修改后的英雄实体对象，apollo根据id字段，在cache中找到了对应的对象,然后会去用新获取到的对象覆盖旧对象，此时cache是自动更新的，我们无需直接对cache做任何操作。返回英雄列表所在的路径，发现英雄列表的确自动更新了。还有一种情况，后端返回的结果不包含一个英雄实体对象，而是返回一个boolean值表示操作是否成功，这时候apollo无法自动更新cache，需要我们手动更新cache。另一种情况，后端返回的英雄实体，并不在cache中，例如addHero操作，返回一个新的英雄对象，这个英雄的ID是后端生成的。此时apollo也不会自动将这个对象加入到cache中。这两种情况都需要我们直接操作cache，操作方法如下：

- 增加一个英雄的schema

  ```ts
  export const ADD_HERO = gql`
  mutation($name:String!){
    addHero(name:$name){
          id,
          name,
          description
    }
  }
  `
  ```

- 使用这个schema向服务器发请求。update字段传入一个函数，proxy参数是数据代理，通过这个参数结合query去获取cache中的数据。第二个参数是mutation操作服务器返回的结果，这里使用解构语法取出data字段的数据。proxy.readQuery方法取出cache中的数据，这个数据的解构和我们执行Query后，服务器返回过来的数据的结构一致。之后我们将新的hero对象加进去，再执行proxy.writeQuery方法将修改后的cache数据写回去，就完成了对cache的操作。

  ```ts
  async addHero(name: string): Promise<Hero> {
      const res = await this.apollo.mutate<any>(
        {
          mutation: ADD_HERO,
          variables: {
            name: name
          },
          update: (proxy, { data }: any) => {
            const dataCache = proxy.readQuery<any>({ query: GET_HEROES });
            dataCache.getHeroes.push(data.addHero);
            proxy.writeQuery({ query: GET_HEROES, data: dataCache });
          },
        }
      ).toPromise();
      return res.data.addHero;
    }
  ```

- 事实上，QueryRef对象除了valueChanges属性之外，还有其他很多有用的属性和方法，其中，result()方法返回一个Promise，使用该方法，会让watchQuery表现的和query一致，方便我们直接使用await获取数据。要注意的是，这里获取到的数据是'cache-first'策略下的数据，QueryRef.refetch()同样返回一个Promise,但它是'network-only'策略。使用result()方法和refetch()方法时注意不要设置fetchPolicy字段，因为fetchPolicy的优先级高于这两个方法，会导致这两个方法工作异常。

  ```ts
    async getHero(id: number): Promise<Hero> {
      const res = await this.apollo.watchQuery<any>(
        {
          query: GET_HERO,
          variables: {
            id
          },
        }
      ).result();
      return res.data.getHero;
      }
  ```

## apollo cache机制总结

- apollo cache不像是restful api的cache，通过url对应一个实体，而是通过对象的唯一标识符来确定一个对象，默认是使用一个对象的id字段和__typename字段,后端用到的所有实体对象，都以id为主键，而codegen自动生成的类型又包括了__typename字段，所以我们不用在graphql.module.ts文件中去显式地设置对象的唯一标识符。
- 当我们在query中，没设置fetchPolicy字段的数据，则默认使用cache，apollo的cache机制是cache first，我们发送query请求时，会确认cache中是否有对应的数据，如果有,则query请求不会发出去，而是直接使用cache中的数据，即使后端数据变了，前端无论怎么切换子路由，query请求发不出去，数据也不会更新。当设置fetchPolicy为'network-only'时，一定会发出query请求，获取最新的数据，收到数据后，将数据写入cache。当fetchPolicy为'no-cache'时，即不读cache，也不写cache，query请求一定会发出去。
- mutation时，后端返回的结果中，如果包含一个cache中旧对象的新版本，那么会自动用新版本的对象覆盖旧对象，例如修改了一个英雄的名字，后端返回修改后的英雄对象，apollo会自动更新cache。当后端返回的结果，不包含实体对象，或者包含一个cache中不存在的新对象时(不存在指的是通过唯一标识符(默认情况下：id+__typename)无法找到)，apollo不会自动更新cache，此时需要我们直接操作cache更新数据。
