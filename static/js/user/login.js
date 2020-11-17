function checkLoginPassword(password){
    console.log(password);
    if (!checkExistData(password, '비밀번호를')){
        return false;
    }
    return true;
}    

function login(){
    const loginId = document.querySelector('#userId');
    const loginPassword = document.querySelector('#userPassword')

    if(!checkUserId(loginId.value)){
        loginId.value='';
        loginId.focus();
        event.preventDefault ();
        return false;
    }else if(!checkLoginPassword(loginPassword.value)){
        loginPassword.value='';
        loginPassword.focus();
        event.preventDefault ();
        return false;
    }else{
        Swal.fire({
            icon: 'success',
            title:'환영합니다.!',
            text: '홈 화면으로 이동합니다.',
            showConfirmButton: false,
            timer: 1500,
            })
    }



}