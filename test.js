var MAX_VA = 0;
var MAX_PB = 0;
var prev_proc;
var PIDarr = [];

class PID {
    constructor(b, prev) 
    {
        if (prev==undefined) 
        {
            this.proc_num = 0;
            this.p_base = 0;
            this.p_bounds = 0 + b;
            if (this.p_bounds > MAX_PB) { MAX_PB = this.p_bounds}
            this.MMU_select = false;
        } else 
        {
            this.proc_num = prev.proc_num + 1;
            prev_proc = this;
            this.p_base = prev.p_bounds;
            this.p_bounds = prev.p_bounds + b;
        }
        this.v_bounds = b;
        if (this.v_bounds > MAX_VA) { MAX_VA = Math.ceil(Math.log2(this.v_bounds))}
        if (this.p_bounds > MAX_PB) { MAX_PB = Math.ceil(Math.log2(this.p_bounds))}

        this.MMU_select = false;
        PIDarr.push(this);
    }
}

function MMU(PID, VA) {
    PID.MMU_select = true;
    console.log("Running PID: " + PID.proc_num);
    console.log("Physical Base: " + PID.p_base);
    console.log("Physical Bounds: " + PID.p_bounds);
    console.log("Virtual Address: " + VA);
    if (VA < PID.p_bounds) {
        console.log("Physical Address: " + (+VA + +PID.p_base));
    } else {
        console.log("Physical Address: undefined");
    }

    console.log("");
    console.log("VA: " + MAX_VA);
    console.log("PA: " + MAX_PB);
}

var proc0 = new PID(1024);
var proc1 = new PID(512, proc0);
var proc2 = new PID(2048, proc1);

//MMU(proc0, 124);
//MMU(proc1, 124);
//MMU(proc2, 124);
console.log(PIDarr);