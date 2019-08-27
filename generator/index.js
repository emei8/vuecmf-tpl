module.exports = (api, options, rootOptions) => {
    api.extendPackage({
      scripts: {
        test: 'vue-cli-service  command'
      }
    })
    api.render('../template')

    /*if (options.module === 'module1') {
        // options.module 可以访问上面问题数组的第一个对象的值，默认为: 'module0'
        console.log(`Your choice is ${options.module}`)
    }

    if (options.moduleName === 'myModule') {
        // options.moduleName 可以访问到用户从控制台输入的文字
        console.log(`Your input is ${options.moduleName}`)
    }*/

}
