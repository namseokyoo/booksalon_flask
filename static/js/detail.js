
function bookboardpage(userName){
    const loginSuccess = document.querySelector('.edit'),
    loginwarning = document.querySelector('.reply_question__text'),
    delete_reply = document.querySelectorAll('.delete_reply'),
    delete_button = document.querySelector('.delete'),
    submit_button = document.querySelector('.btn-logincheck');


    if (userName===''){
        loginSuccess.style.display = 'none';
        loginwarning.disabled='disabled';
        loginwarning.placeholder='댓글 작성은 로그인이 필요합니다.';
        submit_button.style.display = 'none';
        delete_button.style.display = 'none';
        delete_reply.style.display = 'none';
 

    } else{
        loginSuccess.style.display = 'flex';
        loginwarning.disable='false';
        loginwarning.placeholder='새로운 댓글을 입력하세요.';
        delete_button.style.display = 'flex';
        submit_button.style.display = 'flex';
        for (let i = 0; i < delete_reply.length; i++) {
            delete_reply[i].classList.toggle('delete_reply_show');
        }
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