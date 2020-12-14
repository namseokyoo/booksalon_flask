/*$(document).ready(function () {
    listing(); 
})*/

function listing() {
    $.ajax({
        method: "GET",
        url: "/loadbookshelfdb",
        data: {},
        success: function (response) {
            let event = response.event;
            console.log(event);
            book = Object.values(event["0"].books);
            console.log(book);

            for (i = 0; i < book.length; i++) {
                title = book[i].title
                url = book[i].url
                start = book[i].start
                console.log(title)
                booklist = {
                    title: title,
                    start: start,
                    url: url
                }
                calendar.addEvent(booklist)
            }
        }
    })
}

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    // listing();

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            start: "",
            center: "prev title next",
            end: "today",
        },
        titleFormat: function(date) {
            return `${date.date.year}년 ${date.date.month + 1}월`;
        },
        contentHeight: 500,
        dayHeaderContent: function (date) {
            let weekList = ["일", "월", "화", "수", "목", "금", "토"];
            return weekList[date.dow];
        },
        editable:true,
        events: {
            url: "/loadbookshelfdb",
            method: "GET",
            failure: function () {
            alert("아직 책장에 책이 없습니다!");
            },
        },
        eventContent: function(arg) {
            let arrayOfDomNodes = []
            // title event
            // let titleEvent = document.createElement('div')
            // if(arg.event._def.title) {
            //     titleEvent.innerHTML = arg.event._def.title
            //     titleEvent.classList = "fc-event-title fc-sticky"
            // }

            // image event
            let imgEventWrap = document.createElement('div')
            if(arg.event.extendedProps.image_url) {
                let imgEvent = '<img src="'+arg.event.extendedProps.image_url+'" >'
                imgEventWrap.classList = "fc-event-img"
                imgEventWrap.innerHTML = imgEvent;
            }
            // arrayOfDomNodes = [ titleEvent,imgEventWrap ]
            arrayOfDomNodes = [imgEventWrap ]

    
            return { domNodes: arrayOfDomNodes }
        },


        // plugins: ['dayGrid', 'interaction'],
        // editable: true,
        // eventClick: function (info) {
        //     info.jsEvent.preventDefault();
        //     if (confirm('Go to review-page?')) {
        //         window.open(info.event.url);
        //     }
        //     else {
        //         if (confirm('Delete?')) {
        //             info.event.remove();
        //             remove(info.event.title);
        //         }
        //         else {
        //             alert('Delete cancel')
        //         }
        //     }
        // }
    });


    calendar.render();
});

function remove(title) {
    $.ajax({
        method: "GET",
        url: "/bookshelflist_remove",
        data: { title: title },
        success: function (response) {
            let event = response.event;
            console.log(event);
            book = Object.values(event["0"].books);
            console.log(book);
        }
    })
    window.location.reload();
}
