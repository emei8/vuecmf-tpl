module.exports = [
    {
        type: 'list',
        name: 'VueCMF',
        message: '请选择模板，回车继续',
        choices: [
            { name: 'VueCMF', value: 'vuecmf' }
        ],
        default: 'VueCMF'
    },
    {
      type: 'input', // 类型为 输入项
      name: 'app_title',
      message: '请输入应用名称',
      default: 'My VueCMF'
    }
]
