var checkIdCount = 0;
var checkUserNameCount = 0;

function checkExistData(value, dataName) {
    if (value == "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: dataName + ' 입력해주세요',
            })
        event.preventDefault ();
        return false;
    }
    return true;
}

function checkUserId(id) {
    if (!checkExistData(id, '이메일을')){
        event.preventDefault ();
        return false;
    }else{
        var emailRegExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        if (!emailRegExp.test(id)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: '이메일 형식이 올바르지 않습니다.',
                });
            return false;
        }
    return true; 
    }
}

function checkUserName(name) {
    if (!checkExistData(name, '닉네임을')){
        event.preventDefault ();
        return false;
    }else{
        var nameRegExp = /^[a-zA-Z0-9가-힣]{2,12}$/;
        if (!nameRegExp.test(name)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: '닉네임은 한글, 영문 대소문자, 숫자로 2~12자리로 입력해야합니다',
                })
            return false;
        }
    return true; 
    }
}

function checkPassword(id, password1, password2) {
    if (!checkExistData(password1, '비밀번호를')){
        return false;
    }
    if (!checkExistData(password2, '비밀번호 확인을')){
        return false;
    }
    var password1RegExp = /^[a-zA-z0-9]{4,12}$/;
    if (!password1RegExp.test(password1)) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '비밀번호는 영문 대소문자 및 숫자 4~12자리로 입력해야합니다.',
            })
        return false;
    }
    if (password1 != password2) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '비밀번호를 확인해주세요.',
            })
        return false;
    }
    if (id == password1) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '아이디와 비밀번호는 같을 수 없습니다.',
            })
        return false;
    }
    return true;
}    

function checkId(){
    const inputId = document.querySelector('#userId');

    if(!checkUserId(inputId.value)){
        inputId.value='';
        inputId.focus();
        event.preventDefault ();
        return false;
    }

    $.ajax({
        method: 'POST',
        url: '/checkid',
        data: {
            inputId: inputId.value,
        },
        success: function (response) {
            let checkResult = response.checkResult
            if(checkResult==='usable'){
                Swal.fire({
                    icon: 'success',
                    title: 'success!',
                    text: '사용가능한 이메일 입니다.',
                    })
                checkIdCount = 1;
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: '사용중인 이메일 입니다. 다른 이메일을 입력해주세요',
                    })
                inputId.focus();
                checkIdCount = 0;
            }
        }
    })
}

function checkName(){
    const inputUserName = document.querySelector('#userName');

    if(!checkUserName(inputUserName.value)){
        inputUserName.value='';
        inputUserName.focus();
        event.preventDefault ();
        return false;
    }

    $.ajax({
        method: 'POST',
        url: '/checkusername',
        data: {
            inputUserName: inputUserName.value,
        },
        success: function (response) {
            let checkResult = response.checkResult
            if(checkResult==="usable"){
                Swal.fire({
                    icon: 'success',
                    title: 'success!',
                    text: '사용가능한 닉네임 입니다.',
                    })
                checkUserNameCount = 1;
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: '사용중인 닉네임 입니다. 다른 이메일을 입력해주세요',
                    })
                inputUserName.focus();
                checkUserNameCount = 0;
            }
        }
    })
}


function register(){
    const inputId = document.querySelector('#userId');
    const password1 = document.querySelector('#password1');
    const password2 = document.querySelector('#password2');

    if(checkIdCount === 0){
        Swal.fire({
            icon: 'info',
            text: '이메일 중복확인을 해주세요',
            })
        event.preventDefault ();
    }else if(checkUserNameCount === 0){
        Swal.fire({
            icon: 'info',
            text: '닉네임 중복확인을 해주세요',
            })
        event.preventDefault ();
    }else if(!checkPassword(inputId.value, password1.value,
        password2.value)) {
        password1.value = '';
        password2.value = '';
        password1.focus();
        event.preventDefault ();
        return false;
        }else{
        Swal.fire({
            icon: 'success',
            title:'감사합니다!',
            text: '로그인 화면으로 이동합니다.',
            showConfirmButton: false,
            timer: 1500,
            })
        }

}

init();