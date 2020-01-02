module.exports = {
    'env': {
        'node': true,
        'es6': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 2017,
        'sourceType': 'module'
    },
    'rules': {
        //禁用只包含eslint推荐的规则， 开启为自定义规则(0: never, 1:warn, 2:error)
        'no-console': 0,                //禁用console
        'no-unexpected-multiline': 0,   //禁止出现令人困惑的多行表达式
        'default-case': 1,              //要求 switch 语句中有 default 分支
        'dot-location': 0,              //强制在点号之前和之后一致的换行
        'eqeqeq': 0,                    //要求使用 === 和 !==
        'no-multi-spaces': 1,           //禁止使用多个空格
        'no-return-await': 1,           //禁用不必要的 return await
        'no-eval': 2,                   //禁用 eval()
        'no-extend-native': 2,          //禁止扩展原生类型
        'no-new': 2,                    //禁止使用 new 以避免产生副作用
        'no-useless-return': 1,         //禁止多余的 return 语句
        'no-useless-escape': 0,         //禁用不必要的转义字符
        'no-ex-assign': 0,              //禁止对 catch 子句中的异常重新赋值
        'linebreak-style': 'window',    //强制使用一致的换行风格
        'no-lonely-if': 1,              //禁止 if 作为唯一的语句出现在 else 语句中
        'arrow-parens': 0,              //要求箭头函数的参数使用圆括号
        'arrow-spacing': 1,             //强制箭头函数的箭头前后使用一致的空格
        'no-caller': 1,                 //禁止使用arguments.caller或arguments.callee
        'no-delete-var': 1,             //禁止删除变量
        'no-eq-null': 0,                //禁止在没有类型检查操作符的情况下与 null 进行比较
        'no-new-func': 2,               //禁止对 Function 对象使用 new 操作符
        'no-new-wrappers': 2,           //禁止对 String，Number 和 Boolean 使用 new 操作符
        'no-new-require': 2,            //禁止调用 require 时使用 new 操作符
        'no-path-concat': 0,            //禁止对 __dirname 和 __filename 进行字符串连接
        'no-spaced-func': 2,            //函数调用时 函数名与()之间不能有空格
        'no-tabs': 2,                   //禁用Tab

        'new-cap': [
            'error',
            {'capIsNew': false}
        ],
        'indent': [
            'error',
            4,
            {
                'SwitchCase': 1,
                'MemberExpression': 0
            }
        ],
        'linebreak-style': [
            'error',
            'windows'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ]
    }
}