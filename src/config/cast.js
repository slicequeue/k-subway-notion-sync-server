const number = (value) => {
    const result = Number(value)
    if (!Number.isNaN(result)) {
        return result
    }
}

const string = (value) => value

const typeConverter = { number, string }

const cast = (key, type, defaultValue) => {
    const value = process.env[key]
    if (value !== undefined) {
        const result = typeConverter[type](value)
        if (result !== undefined) {
            return result
        }
        throw new Error(`process.env.${key}에 적절한 값을 설정하지 않았습니다`)
    }
    console.log('defaultValue', defaultValue);
    if (defaultValue !== undefined) {
        return defaultValue
    }
    throw new Error(`process.env.${key}에 할당할 값이 없습니다`)
}

module.exports = {
    cast
}