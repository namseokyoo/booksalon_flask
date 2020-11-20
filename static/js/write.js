
function writepage(userName){
    const loginSuccess = document.querySelector('.board'),
    loginwarning = document.querySelector('.warning');

    if (userName===''){
        loginSuccess.style.display = 'none';
        loginwarning.style.display = 'inline-block';
    } else{
        loginSuccess.style.display = 'block';
        loginwarning.style.display = 'none';
    }

}


function checklogin(){
    $.ajax({
        type: "GET",
        url: '/getusername',
        data: {},
        success: function(data) {
            let userName = data["userName"];
            writepage(userName)
        }
    })
}

function init(){
    checklogin();
}

init();