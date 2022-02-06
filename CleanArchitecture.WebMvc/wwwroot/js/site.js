
const nav_item_links = document.querySelectorAll(".nav__item-link");
const sub_links = document.querySelectorAll(".sub_link");

function collapseNav(head, toggler, sidenav) {
    const header = document.getElementById(head);
    const nav_toggler = document.getElementById(toggler);
    const nav = document.getElementById(sidenav);


    nav_toggler.addEventListener('click', function () {
        this.classList.toggle('fa-times');
        nav.classList.toggle('collapse-nav');
        header.classList.toggle('collapse-header');

        nav_item_links.forEach(alink => {
            if (alink.classList.contains('active')) {
                //alink.classList.remove('active');

                const child_nav = alink.nextElementSibling;
                if (child_nav) {
                    child_nav.classList.add('collapse-child-nav');
                }
            }
        });
    })
}

collapseNav("header", "nav-toggler", "nav")

nav_item_links.forEach(link => {
    link.addEventListener('click', function () {
        nav_item_links.forEach(alink => {
            if (alink.classList.contains('active')) {
                alink.classList.remove('active');

                const child_nav = alink.nextElementSibling;
                if (child_nav) {
                    child_nav.classList.add('collapse-child-nav');
                }
            }
        });
        this.classList.toggle('active');
        //debugger;
        const child_nav = this.nextElementSibling;
        if (child_nav) {
            child_nav.classList.toggle('collapse-child-nav');
        }
    })
})

sub_links.forEach((link) => {
    link.addEventListener('click', function () {
        sub_links.forEach(alink => {
            if (alink.classList.contains('active-sub-link')) {
                alink.classList.remove('active-sub-link');
            }
        });

        link.classList.toggle('active-sub-link');
    })
})