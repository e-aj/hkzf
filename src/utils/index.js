import axios from "axios"
// 获取定位函数
export const getCurrentCity = () => {
    const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
    if (!localCity) {
        return new Promise((resolve, reject) => {
            const curCity = new window.BMapGL.LocalCity();
            curCity.get(async res => {
                try {
                    // console.log(res)
                    const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)

                    // 存储
                    localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
                    resolve(result.data.body)

                } catch (e) {
                    // 获取定位城市失败
                    reject(e)

                }
            })
        })
    }
    return Promise.resolve(localCity)

}