cloudread
=========

新华网炫知阅读: [http://xuan.news.cn/cloudread/#mytm/20140704/1774014](http://xuan.news.cn/cloudread/#mytm/20140704/1774014)

###依赖: [f2e-server](https://github.com/shy2850/node-server) 开发、运行、测试和打包。
###conf example: 

    exports['reader.news.cn'] = {
        root:'/cloudread/',  /* install Root*/
        agent:{
            get:function(){
                return {
                    host:'xuan.news.cn'
                };
            }
        }
    }
