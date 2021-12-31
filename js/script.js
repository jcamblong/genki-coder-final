let data = [];

$.getJSON('/data/productos.json', (datos) => {
    datos.forEach( element => {
        data.push(element)
    })
});

let cart = document.querySelector('.shopping-cart-container');

document.querySelector('#cart-btn').onclick = () => {
    cart.classList.toggle('active');
    navbar.classList.remove('active');

    let valorCarrito = parseInt(sessionStorage.getItem('total'));
    let costoIva = valorCarrito * 0.21;
    let costoTotal = valorCarrito * 1.21;

    if (isNaN(valorCarrito)) {
        document.querySelector('.cart-total .box .subtotal span').innerHTML = `<span>$0</span>`;
        document.querySelector('#iva span').innerHTML = `<span>$0</span>`;
        document.querySelector('.cart-total .box .total span').innerHTML = `<span>$0</span>`;
    } else {
        document.querySelector('.cart-total .box .subtotal span').innerHTML = `<span>$${valorCarrito}</span>`;
        document.querySelector('#iva span').innerHTML = `<span>$${costoIva.toFixed(2)}</span>`;
        document.querySelector('.cart-total .box .total span').innerHTML = `<span>$${costoTotal.toFixed(2)}</span>`;
    }

}

let navbar = document.querySelector('.header .navbar');

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    cart.classList.remove('active');
}

window.onscroll = () => {
    navbar.classList.remove('active');
}

document.querySelector('.home').onmousemove = (e) => {

    let x = (window.innerWidth - e.pageX * 2) / 90;
    let y = (window.innerHeight - e.pageY * 2) / 90;

    document.querySelector('.home .home-parallax-img').style.transform = `translateX(${y}px) translateY(${x}px)`;
}

document.querySelector('.home').onmouseleave = () => {

    document.querySelector('.home .home-parallax-img').style.transform = `translateX(0px) translateY(0px)`;
}


// Funciones onLoad
window.onload = function () {

    data.forEach(element => {
        let div = document.createElement('div');
        div.setAttribute('class', 'box');
        div.setAttribute('id', element.id);
        div.innerHTML = `
                    <a href="#" class="fas fa-heart"></a>
                    <div class="image">
                        <img src="image/food-${element.image}.png" alt="">
                    </div>
                    <div class="content">
                        <h3>${element.name}</h3>
                        <div class="stars">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star-half-alt"></i>
                            <span> (x10) </span>
                        </div>
                        <div class="price">$${element.price}</div>
                        <a class="btn">agregar</a>
                    </div>
                `;

        document.getElementById('product-list').appendChild(div);
    });

    let unicos = [...new Set(data.map(item => item.category))];

    unicos.forEach((element, index) => {
        let div = document.createElement('a');
        div.setAttribute('href', '#');
        div.setAttribute('class', 'box');

        div.innerHTML = `
            <img src="image/cat-${index + 1}.png" alt="">
            <h3>${element}</h3>
    `;
        document.getElementById('categories').appendChild(div);
    })

    // Funcion agregar al carrito onLoad
    $('#product-list div div.content a').on('click', function () {
        let seleccionado = $(this).closest('.box');
        let nombre = seleccionado.find('h3').text();
        let precio = parseInt(seleccionado.find('.price').text().substring(1));
        let id = seleccionado.attr('id');

        let div = document.createElement('div');
        div.setAttribute('class', 'box');

        div.innerHTML = `
                    <i class="fas fa-times"></i>
                    <img src="image/menu-4.png" alt="">
                    <div class="content">
                        <h3>${nombre}</h3>
                        <span> quantity : </span>
                        <input type="number" name="" value="1" id="">
                        <br>
                        <span> price : </span>
                        <span class="price"> $${precio} </span>
                    </div>
                    `
        document.querySelector('.products-container .box-container').appendChild(div)

        if (sessionStorage.getItem('total')) {
            let valorActual = parseInt(sessionStorage.getItem('total'));
            let total = valorActual + precio;
            console.log(total);
            sessionStorage.setItem('total', total)
        } else {
            sessionStorage.setItem('total', precio);
        }
    })
}

// FIN Funciones onLoad

$('#send-form').click( (e) => {
    e.preventDefault()
    
    const postURL = 'https://jsonplaceholder.typicode.com/posts';
    let salida = [];
    let formulario = document.querySelectorAll('#contact-form .data');

    formulario.forEach(element => {
        let actual = { [element.name]: element.value }
        salida.push(actual);
    });

    $.post(postURL, salida, (res, estado) => {
        if ( estado === 'success') {
            console.log(salida)
            console.log(res);
            $('#contact-form').append(`<p id="form-success">Formulario Enviado!</p>`)
        }
    })

});

// Funcion eliminar del carrito
$('.products-container .box-container').on('click', '.fas.fa-times', function () {
    const card = document.querySelectorAll('.products-container .box-container .box');
    for (let i = 0, len = card.length; i < len; i++) {
        card[i].onclick = function () {
            let valorCarrito = parseInt(sessionStorage.getItem('total'));
            let precio = card[i].querySelector('.price').innerHTML.substring(2);

            let subtotal = valorCarrito - precio;
            sessionStorage.setItem('total', subtotal);

            let costoIva = subtotal * 0.21;
            let costoTotal = subtotal * 1.21;

            document.querySelector('.cart-total .box .subtotal span').innerHTML = `<span>$${subtotal}</span>`;
            document.querySelector('#iva span').innerHTML = `<span>$${costoIva.toFixed(2)}</span>`;
            document.querySelector('.cart-total .box .total span').innerHTML = `<span>$${costoTotal.toFixed(2)}</span>`;
            
            card[i].parentNode.removeChild(card[i]);
        }
    }
})