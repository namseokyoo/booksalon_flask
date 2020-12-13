const isBookshelf = document.querySelector(".is_my_bookshelf");
const setBookshelfBtn =document.querySelector(".set_my_bookshelf");

function getQueryStringObject() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}

function showingBookshelf(){
    isBookshelf.classList.add("checkbookshelf_show");
    setBookshelfBtn.classList.remove("checkbookshelf_show");
}

function hideBtn(){
    setBookshelfBtn.classList.add("checkbookshelf_show");
}

function checkbookshelf(){
    var qs = getQueryStringObject();
    var isbn = qs.book;
    
    $.ajax({
        method: 'POST',
        url: '/checkbookshelfdb',
        data: {
            isbn : isbn,
        },
        success: function (response) {
            if(response['result'] == 'success'){
                console.log("ok")
                showingBookshelf();
            }else{
                hideBtn();
            }
        }
    });

}



// function bookshelfInfo(){
//     Swal.fire({
//         title: '간단한 메모를 남겨주세요',
//         input: 'text',
//         inputAttributes: {
//           autocapitalize: 'off'
//         },
//         showCancelButton: true,
//         confirmButtonText: '추가하기',
//         showLoaderOnConfirm: false,
//         preConfirm: (login) => {
//           return fetch(`//api.github.com/users/${login}`)
//             .then(response => {
//               if (!response.ok) {
//                 throw new Error(response.statusText)
//               }
//               return response.json()
//             })
//             .catch(error => {
//               Swal.showValidationMessage(
//                 `Request failed: ${error}`
//               )
//             })
//         },
//         allowOutsideClick: () => !Swal.isLoading()
//       }).then((result) => {
//         if (result.isConfirmed) {
//           Swal.fire({
//             title: `${result.value.login}'s avatar`,
//             imageUrl: result.value.avatar_url
//           })
//         }
//       })
// }

function setBookshelfDb(){
    var qs = getQueryStringObject();
    var isbn = qs.book;
    
    $.ajax({
        method: 'POST',
        url: '/setbookshelfdb',
        data: {
            isbn : isbn,
        },
        success: function (response) {
            if(response['result'] == 'success'){
                    Swal.fire({
                        icon: 'success',
                        title:'성공',
                        text: '내 책장에 추가되었습니다',
                        showConfirmButton: false,
                        timer: 1200,
                    })
                    showingBookshelf();
            }
        }
    });
}

function init(){
    checkbookshelf();
}

init();