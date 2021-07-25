'use strict';
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
///////////////////////////////////////
// Modal window



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
////////////////////////////////////////////
////////////WORKING ON THE PROJECT 
////////IMPLEMENTING SMOOTH SCROOLING 
////we will do this with 2 methods 

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
 // console.log(s1coords);

  //console.log(e.target.getBoundingClientRect());

  //console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset);
  
  //console.log('height/width viewport',
    //document.documentElement.clientHeight,
    //document.documentElement.clientWidth
  //);
  /*method 1
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });
  */
  /////more modern way to do this ..
  section1.scrollIntoView({ behavior: 'smooth' });
   
});
//////////////////////////////////////////////////////////////////
/////////////LECTURE 189
/////////////EVENT DELEGATION:IMPLEMENTING PAGE NAVIGATION .....

/*
////method 1
document.querySelectorAll('.nav__link').forEach(function(el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();//ye jo hm normally section 1 /2/3 tk pahuch rahe the wo rok dega
    const ide = this.getAttribute('href');
    console.log(ide);
    document.querySelector(ide).scrollIntoView({ behavior: 'smooth' });
  });
});

in this method we added event listeners to all the three nav links ...which not a good practise if we have 1000 or 10000 links so we are going to use event delegation /bubbling  concept ...
*/
///METHOD 2
//////// event delegation method .... 
///1. ADD EVENT LISTNER TO COMMON PARENT ELEMENT 
///2. DETERMINE WHAT ELEMENT THE EVENT ORIGINATES 

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();//ye jo hm normally section 1 /2/3 tk pahuch rahe the wo rok dega
  ////matching startegy 
  if (e.target.classList.contains('nav__link')) {
   
    const id = e.target.getAttribute('href');
    //console.log(ide);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
/*
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
*/
//////////////////////////////////////////////////////////////////
/////////////LECTURE 191
/////////////building a tabbed components 

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

//for event delegation we attach event to parent ..

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
 // console.log(clicked);
    ///gaurd classs..
  if (!clicked) return;///buittons k alwa kahin bhi click hua to hme return ho jana hai ....
  ////activating tabs 
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');///before adding this here we have to remove this from the rest of the others 
  ///activating the content 
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});
//////////////////////////////////////////////////////////////////
/////////////LECTURE 192
/////////////passing argumconent to event handlers 
// Menu fade animation
const nav = document.querySelector('.nav');
const handleHover=function (e) {
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
/*
//////////////////////////////////////////////////////////////////
/////////////LECTURE 193
////////////sticky navigation ....
//const section1 = document.querySelector('#section--1');
const intialCoords = section1.getBoundingClientRect();
console.log(intialCoords);

window.addEventListener('scroll', function () {
  console.log(window.scrollY);

  if (window.scrollY > intialCoords.top) {
    nav.classList.add('sticky');
  }
  else {
    nav.classList.remove('sticky');
  }
});
*/
//////////////////////////////////////////////////////////////////
/////////////LECTURE 193
////////////a better way : the intersection observer api 
/*
const obsCalback = function (entries, observer) {
   //entries are array of threshold entry
};
const obsOptions = {
  root: null,
  threshold: 0.1
};

const observer = new IntersectionObserver(obsCalback, obsOptions);
observer.observe(section1);

*/

const header = document.querySelector('.header');
//const navHeight = nav.getBoundingClientRect().height;
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};


const headerObserver = new IntersectionObserver(stickyNav,{
  root: null,
  threshold: 0,
  rootMargin:`-${navHeight}px`,//this give a box of specified margin to the target elementt...
});


headerObserver.observe(header);

//////////////////////////////////////////////////////////////////
/////////////LECTURE 193
////////////reveal section 

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;//section 1 hmara target tha to wo sahi se kaam nhi kar raha tha ... to hm ye likhna hogsa taki saare section ka translation sahi se ho

  entry.target.classList.remove('section--hidden');// we are goimg to do this because ... we have remove this class and have that translation effect
  observer.unobserve(entry.target);///hmare kaam hone pe hm isko unobserve kar dennge 
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
//////////////////////////////////////////////////////////////////////////
/////////////LECTURE 196
///////////lazy loadig images

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//////////////////////////////////////////////////////////////////////////
/////////////LECTURE 197
///////////slider making
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;//slide is nodelist to iske pass bhi array k jaise hi kuch methods hote hai 

  //slides.forEach((s, i) => s.style.transform = `translateX(${100 * i}%)`);//we this we have write or call gotoslide function with 0 as the arrgument 
  //o% 100% 200% 300%
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
  };
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };



  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  }
  init();
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
  ///going to next slide 
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  //-100% 0% 200% 300%

  ///now adding keyevents in sliders 
  document.addEventListener('keydown', function (e) {
    //console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  })

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      //
      //console.log('DOT');
      const { slide } = e.target.dataset;//we destructing the slide
      goToSlide(slide);
      activateDot(curSlide);
    }
  })
};
slider();

///////////////////////////////////////
///////LECTURE 186 
//////TYPE OF EVENTS AND EVENT HANDLERS 

/*;

h1.addEventListener('mouseenter', function (e) {
  alert('addEventListener: aap padh rahe hai heading :D');
});

////OLD WAY TO DO THE SAME ...
h1.onmouseenter = function (e) {
  alert('addEventListener: aap padh rahe hai heading :D');
};
///benifits of using addeventlistner is that we can simply remove the event by using removeeventlistner


////now ways to remove eventlistner ...
const h1 = document.querySelector('h1');
const alertH1= function (e) {
  alert('addEventListener: aap padh rahe hai heading :D');
  h1.removeEventListener('mouseenter',alertH1);
};
h1.addEventListener('mouseenter', alertH1);

//setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 1000);







/*
//////////////////////////////////////////////////////////////////////////
/////////////LECTURE183
////////////SELECTING CREATING AND DELETING THE ELEMENT ...
console.log(document.documentElement);//this we write the whole html in the console 
console.log(document.head);//head will be in the console
console.log(document.body);//body will be in the console
const header=document.querySelector('.header');//selects the first element with header class
const allSelector = document.querySelectorAll('.section')//return the nodelist ....
console.log(allSelector);/*NodeList(4)
0: section#section--1.section
1: section#section--2.section
2: section#section--3.section
3: section.section.section--sign-up
length: 4
__proto__: NodeList
document.getElementById('section--1');//takes the element by id not by class 
const allButton = document.getElementsByTagName('button');
console.log(allButton);////HTMLCollection(9) [button.btn--text.btn--scroll-to, button.btn.operations__tab.operations__tab--1.operations__tab--active, button.btn.operations__tab.operations__tab--2, button.btn.operations__tab.operations__tab--3, button.slider__btn.slider__btn--left, button.slider__btn.slider__btn--right, button.btn.btn--show-modal, button.btn--close-modal, button.btn]
///html colllection is differnt from the node list because its a live collection if the dom changes it will automatically change itself 
//node list donot update itself once its variable is created or it is created ...
console.log(document.getElementsByClassName('btn'));///while writting the code . is not requied and it will also return a htmlcollection /HTMLCollection(5) [button.btn.operations__tab.operations__tab--1.operations__tab--active, button.btn.operations__tab.operations__tab--2, button.btn.operations__tab.operations__tab--3, button.btn.btn--show-modal, button.btn]


///////////////creating and inserting the element ...
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = 'we use cookied for improved funtionality and analytics. <button class="btn btn--close--cookie">got it !</button>';
header.prepend(message);//prepending add the element by adding the element as the first element ...
//header.append(message);//this will add at last of the header ..

///we noticed that when we wrote the code for prepend and apppend message appear at only one place because message is acting as live person cant be present at more than one place at one time ...///dom element are unique can be present one at a time

////for having the cookie message at 2 place ..
//header.prepend(message.cloneNode(true));///done
//header.before(message);///ekam uppar me aayega...
//header.after(message);
/////delete element
document.querySelector('.btn--close--cookie').addEventListener('click', function () {
  message.remove();///this is a very new feature ..
  ///earlier..
 // message.parentElement.removeChild(message);
})
/////////////////////////////////////////////
////////lecture 184
//////style attribute and classes .....
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color);//nothing will be logged in the console ...
console.log(message.style.backgroundColor);///rgb(55, 56, 61)

//// for geeting the prop which we are not specified manually by the .. we can use following line of code or prop .
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';
////working with the css custom prop. or css variables ...
document.documentElement.style.setProperty('--color-primary', 'orangered');///jahn jahn green tha wahn wahn orange red hojayega except in that gradient in the text ... going it the header;


//////////////////////////////////////////
//////ATTRIBUTES 
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);/////Bankist logo
console.log(logo.src);////file:///C:/Users/billi/Desktop/bankist/13-Advanced-DOM-Bankist/starter/img/logo.png
console.log(logo.className);///nav__logo
console.log(logo.designer);//this not the standard attribute that img should have so this will give undefined ...

////for seting the attribute we have simply write :
logo.alt = 'sundar logo h';///inspect me check karne se show karega 




////but we can get these prop too..
console.log(logo.getAttribute('designer'));//lakshmi
logo.setAttribute('company', 'bankist ');///inspect me check karne se show karega 
console.log(logo.src);///file:///C:/Users/billi/Desktop/bankist/13-Advanced-DOM-Bankist/starter/img/logo.png
console.log(logo.getAttribute('src'));///img/logo.png

const link = document.querySelector('.nav__link--btn');
console.log(link.href);//file:///C:/Users/billi/Desktop/bankist/13-Advanced-DOM-Bankist/starter/index.html#
console.log(link.getAttribute('href'));//#

// Data attributes
console.log(logo.dataset.versionNumber);//3.0

//////////classes
///we have different method like add remove toggle contains 
logo.classList.add('c','j','d');
logo.classList.remove('c');
logo.classList.toggle('d');
logo.classList.contains('c');

///dont use
logo.className = 'jonas';///dont use this because this will over write the all code ...
///////////////////////////////////
//////LECTURE 188 
/// EVENT PROPAGATION IN PRACTICE 
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);//true ..kyunki bibble hote time cureent targent change hota h .. aur wo hota h wo jahn pe bubble up karte time click event pahuchta ..isliye niche wale parent element wo uska ... current parnet element hoga ... aur jahn se event suru hua h( mtlb ki kisko target bnyagya )...usme hoga wo jisko hmne click kiya ..agar feature ko feature aayega ..

  // Stop propagation
  // e.stopPropagation();///if we use this parent element willnot change their prop...aur bgcolor..
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
}, false);// when we write true here ... we will start the event in capturing phase so first nav will log in console ...thin container then link ... this will like reverse of bubbling phase ....///BY DEFAULT THIS IS SET FALSE ..AND NOW WE ARE SETTING THIS TO FALSE 
*/