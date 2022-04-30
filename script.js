'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// smooth scroll

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  // console.log('current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  // console.log(
  //   ('height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth)
  // );

  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page Navigation

// 1.add the event listener to a common parent element of all the elements we are interested in.
// 2. determine which target element generated the event.(event.target)

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // matching strategy -selecting the elements themselves and not the parent element
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
// Tabbed Content

// add event listener to the parent  - event propagation
tabsContainer.addEventListener('click', function (e) {
  // find out which button was clicked -use the closest method on tabs so that the number in the buttons work as well
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  // Guard Clause
  if (!clicked) return;

  // removing the active classes - first remove all active classes from both the tabs and the tabs container
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // activate tab
  clicked.classList.add(`operations__tab--active`);

  // activate content area
  console.log(clicked.dataset.tab);

  //selecting which content area to display - dataset - changing the data tab in the html the correct number to display content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation

// what not to do
// const initialCoords = section1.getBoundingClientRect()//position of section one
// // console.log(initialCoords);

// window.addEventListener('scroll',function(){
//   // console.log(window.scrollY);//get position of current scroll - go to top of page
// if(window.scrollY > initialCoords.top)nav.classList.add('sticky');
// else nav.classList.remove('sticky');//adding/removing sticky class to html

// });

// Sticky navigation :Intersection Observer API

// create new intersection observer
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal sections

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy Loading Images

// 1.selecting the targets i want to manipulate
const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);

// 4.create callback function(loadImg)
const loadImg = function (entries, observer) {
  // 6.create functionality - get entry from threshold
  const [entry] = entries;
  // console.log(entry);
  // 7.set it to only do something if they are intersecting
  // guard clause
  if (!entry.isIntersecting) return;
  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  // listen for the img load event(happens in background in JS)
  entry.target.addEventListener('load', function () {
    // remove the blurry filter after the load event has taken place
    entry.target.classList.remove('lazy-img');
  });
  // 8. stop observing images once loaded
  observer.unobserve(entry.target);
};

// 2.create image observer
const imgObserver = new IntersectionObserver(loadImg, {
  // 5.set root, threshold, root margin
  root: null,
  threshold: 0,
  // 9.make the img load faster so the user wont notice
  rootMargin: '100px', //img load 100px before it reaches the intersection
});

// 3.attach observer to the targets - with a loop (forEch)
imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
///////////////////////////////////////
///////////////////////////////////////////////////////////////

// Selecting Elements

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');
// const allButtons = document.querySelectorAll('button');
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

// // Creating and inserting elements
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for improved functionality and analytics.';
// message.innerHTML = `We use cookies for improved functionality and analytics.<button class="btn btn--close--cookie">Got it!</button>`;

// // header.prepend(message);
// header.append(message);
// // header.prepend(message.cloneNode(true));

// // header.before(message);
// // header.after(message);

// // Delete Elements
// document.querySelector('.btn--close--cookie').addEventListener('click', function(){
//   message.remove();
//   // old way
//   // message.parentElement.removeChild(message);
// });

// // Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.color);
// console.log(message.style.backgroundColor);//works with inline styles that we set

// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// message.style.height = Number.parseInt(getComputedStyle(message).height, 10) + 20 + 'px';

// console.log(getComputedStyle(message).height);

// // to set style on document root
// document.documentElement.style.setProperty('--color-primary','teal');

// // Attributes

// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.className);
// console.log(logo.src);

// // non-Standard
// console.log(logo.designer);//wont work not standard
// console.log(logo.getAttribute('designer'));//work around
// logo.setAttribute('company','Bankist');

// console.log(logo.src);//actual ip
// console.log(logo.getAttribute('src'));//whats in the html

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// // Data Attributes
// console.log(logo.dataset.versionNumber);// use dataset and camelCase bit after data in html

// // Classes
// logo.classList.add('c','j');
// logo.classList.remove('c','j');
// logo.classList.toggle('c');
// logo.classList.contains('c');//not includes like arrays

// // dont ever use
// // logo.className = 'Jonas' , rather use above methods

// // smooth scroll

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function(e) {
// //create link to dom elements
// const s1coords = section1.getBoundingClientRect();// gets the viewport co-ordinates
// console.log(s1coords);
// console.log(e.target.getBoundingClientRect());// gets x/y of viewport - current scroll position
// console.log('current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

// console.log(('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth));// see the current portion of the page

// // scrolling -

// // current position + current scroll position - pass in an object instead of one argument - OLD WAY OF DOING IT
// // window.scrollTo({
// //   left: s1coords.left + window.pageXOffset,
// //   top:  s1coords.top +window.pageYOffset,

// //   behavior:'smooth',
// //  });
// // NEW WAY - only works in modern browsers

// section1.scrollIntoView({behavior: 'smooth'})//auto also an option
// });

// // event handlers

// const h1 = document.querySelector('h1');// selecting h1 element
// const alertH1 = function(e) {//create a function that takes and event and creates the alert
//   alert('addEventListener :Great! you are reading the heading :D');
//   // setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
// };

// // add event listener to the h1 element with created function
// h1.addEventListener('mouseenter', alertH1);

// // removing the event listener - add it into function if you want to repeat itself or use out of the function if you only want the event to happen once
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// // example of propagation
// // creating a random color and attaching it to the features nav-link
// // rgb(255,255,255)

// const randomInt = (min,max)=> Math.floor(Math.random() * (max-min+1));
// const randomColor = ()=> `rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`;
// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function(e){
// this.style.backgroundColor = randomColor();
// console.log('Link', e.target, e.currentTarget);
// });

// document.querySelector('.nav__links').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('Container', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('Container', e.target, e.currentTarget);
// },false);//default false , true if you want to see catching phase

// // DOM Traversing

// const h1 = document.querySelector('h1');

// // Going Down: to child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'blue';

// // going up - to parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

// //going sideways - siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function(el){
//   if(el !== h1){
//     el.style.transform = 'scale(0.5)'
//   };
// });

// Lifecycle of DOM events
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree Built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page Fully Loaded');
});

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  // e.returnValue = '' - will bring up message asking used if they are sure they want to leave
});

// for fastest loading times ues the defer method on the script tag at teh end of the head.
