



function loginheader(userName){
    const loginSuccess = document.querySelector('.login_success'),
        registerLink = document.querySelector('.register__link'),
        userid = document.querySelector('#user_id');

    if (userName===''){
        loginSuccess.style.display = 'none';
        registerLink.style.display = 'inline-block';
    } else{
        loginSuccess.style.display = 'inline-block';
        registerLink.style.display = 'none';
        userid.innerText = `${userName}님 반갑습니다.`
    }

}

function checklogin(){
    $.ajax({
        type: "GET",
        url: '/getusername',
        data: {},
        success: function(data) {
            let userName = data["userName"];
            loginheader(userName)
        }
    })
}

function init(){
    checklogin();
}

init();