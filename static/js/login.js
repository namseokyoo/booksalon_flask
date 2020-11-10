



function loginheader(loginId){
    const loginSuccess = document.querySelector('.login_success'),
        registerLink = document.querySelector('.register__link'),
        userid = document.querySelector('#user_id');

    if (loginId===''){
        loginSuccess.style.display = 'none';
        registerLink.style.display = 'inline-block';
    } else{
        loginSuccess.style.display = 'inline-block';
        registerLink.style.display = 'none';
        userid.innerText = `${loginId}님 반갑습니다.`
    }

}

function checkloginid(){
    $.ajax({
        type: "GET",
        url: '/getuserid',
        data: {},
        success: function(data) {
            let loginId = data["login_id"];
            console.log(loginId);
            loginheader(loginId)
        }
    })
}

function init(){
    checkloginid();
}

init();