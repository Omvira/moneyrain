class Tween{
    constructor(timeArray,valueArray){
        this.times =  timeArray||[];
        this.values = valueArray||[]
    }

    lerp(t){
        let i=0;
        let n =  this.times.length;
        while(i<n&&t>this.times[i]){
            i++
        }
        if 
    }
}