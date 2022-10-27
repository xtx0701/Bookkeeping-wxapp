const stringOperation = (submitNum: string) => {
    // 键盘计算等式的方法
    const computeSymbol: string = (submitNum.match(/(\+|\-)+/) as any)[0];
    const computeArr: string[] = submitNum.split(computeSymbol);
    // 判断符号后进行加减运算
    if (computeSymbol === '+') submitNum = (Number(computeArr[0]) + Number(computeArr[0])).toString();
    else submitNum = (Number(computeArr[0]) - Number(computeArr[0])).toString();
    return { submitNum, computeSymbol };
};

export default stringOperation;