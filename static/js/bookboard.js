
function bookboardpage(userName){
    const loginSuccess = document.querySelector('.write_question');
        // userid = document.querySelector('#user_id');

    if (userName===''){
        loginSuccess.style.display = 'none';
        // registerLink.style.display = 'inline-block';
    } else{
        loginSuccess.style.display = 'flex';
        // registerLink.style.display = 'none';
        // userid.innerText = `${userName}님 반갑습니다.`
    }

}


function checklogin(){
    $.ajax({
        type: "GET",
        url: '/getusername',
        data: {},
        success: function(data) {
            let userName = data["userName"];
            bookboardpage(userName)
        }
    })
}

function init(){
    checklogin();
}

init();