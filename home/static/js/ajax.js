$(function () {
        $('#send_to_email').on('submit', function (e) {
        e.preventDefault();
        let $that = $(this);
        let fd = $that.serializeArray()
        $.ajax({
            url: $that.attr('action'), // путь к обработчику берем из атрибута action
            type: $that.attr('method'), // метод передачи - берем из атрибута method
            data: fd,
            dataType: 'json',
            success: function (data) {
                modalClose()
                // В случае успешного завершения запроса...
                if (data.status) {
                    Swal.fire({
                        icon: 'success',
                        html: data.message,
                        timer: 4000,
                        background: '#0e1726',
                        timerProgressBar: true,
                        showConfirmButton: false,
                    })
                } else
                    Swal.fire({
                        icon: 'error',
                        html: data.message,
                        timer: 4000,
                        background: '#0e1726',
                        timerProgressBar: true,
                        showConfirmButton: false,

                    })
            }
        });
    });
});