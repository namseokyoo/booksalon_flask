function checkLoginPassword(password){
    if (!checkExistData(password, '비밀번호를')){
        return false;
    }
    return true;
}    

function checkIdDb(id){
    var checkIDResult
    $.ajax({
        method: 'POST',
        url: '/checkid',
        async: false,
        data: {
            inputId: id,
        },
        success: function (response) {
            checkIDResult = response.checkResult;
        }
    });
    if(checkIDResult==='unusable'){
        return true;
    }else{
        return false;
    }
}

function checkPasswordDb(id, password){
    var checkPWResult
    $.ajax({
        method: 'POST',
        url: '/checkpassword',
        async: false,
        data: {
            inputId : id,
            inputpassword : password,
        },
        success: function (response) {
            checkPWResult = response.checkResult
        }
    });
    if(checkPWResult==='success'){
        return true;
    }else{
        return false;
    }
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
    }else if(!checkIdDb(loginId.value)){
        Swal.fire({
            icon: 'error',
            title:'Oops...',
            text: '이메일을 확인해주세요',
            showConfirmButton: false,
            timer: 1500,
            });
        loginId.value='';
        loginPassword.value='';
        event.preventDefault ();
        return false;
    }else if(!checkPasswordDb(loginId.value, loginPassword.value)){
        Swal.fire({
            icon: 'error',
            title:'Oops...',
            text: '비밀번호를 확인해주세요',
            showConfirmButton: false,
            timer: 1500,
            });
        loginPassword.value='';
        event.preventDefault ();
        return false;
    }else{
        Swal.fire({
        icon: 'success',
        title:'환영합니다.!',
        text: '홈 화면으로 이동합니다.',
        showConfirmButton: false,
        timer: 1500,
        });
    }
}