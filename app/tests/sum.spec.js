const {sum}=require("../sum");
describe("sum.js",()=>{
    it("adds 1+2 to equal to equal 3", ()=>{
        const a=1;
        const b=2;
        const result = sum(a,b);
        expect(result).toBe(3);
    })
})