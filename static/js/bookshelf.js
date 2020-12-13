/*$(document).ready(function () {
    listing(); 
})*/

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    listing();

    var calendar = new FullCalendar.Calendar(calendarEl, {
        height: 700,
        plugins: ['dayGrid', 'interaction'],
        editable: true,
        locale: 'ko',
        eventClick: function (info) {
            info.jsEvent.preventDefault();
            if (confirm('Go to review-page?')) {
                window.open(info.event.url);
            }
            else {
                if (confirm('Delete?')) {
                    info.event.remove();
                    remove(info.event.title);
                }
                else {
                    alert('Delete cancel')
                }
            }
        }
    });

    function listing() {
        $.ajax({
            method: "GET",
            url: "/bookshelflist",
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
