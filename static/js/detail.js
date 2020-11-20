
function bookboardpage(userName){
    const loginSuccess = document.querySelector('.edit'),
    loginwarning = document.querySelector('.reply_question__text'),
    delete_reply = document.querySelector('.delete_reply');


    if (userName===''){
        loginSuccess.style.display = 'none';
        loginwarning.disabled='disabled';
        loginwarning.placeholder='댓글 작성은 로그인이 필요합니다.';
        delete_reply.style.display = 'none';

    } else{
        loginSuccess.style.display = 'flex';
        loginwarning.disable='false';
        loginwarning.placeholder='새로운 댓글을 입력하세요.';
        delete_reply.style.display = 'inline';
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