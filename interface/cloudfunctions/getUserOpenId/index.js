const cloud = require('wx-server-sdk')

cloud.init({ env: 'bleem-one-0g7wf6h4992ae3cd' })

// 云函数入口函数
exports.main = async (event, context) => {
        return new Promise((resolve, reject) => {
                try {
                        const wxContext = cloud.getWXContext()
                        resolve(wxContext);
                } catch (err) {
                        throw err;
                }
        })
}