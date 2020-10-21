export function debugConsole(msg){
    if(localStorage.getItem("debug")){
        console.log(msg);
    }
}

export default debugConsole;