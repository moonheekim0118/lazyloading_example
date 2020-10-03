// Image 태그내 이미지, IntersectionObserver를 이용한 레이지 로딩 
const images = document.querySelectorAll('img');

const lazyLoad= (target)=>{ //  img 내 이미지 
    let io = new IntersectionObserver((entries, observer)=>{
        entries.forEach((entry)=>{
            if(entry.isIntersecting){
                const img= entry.target;
                const src =img.getAttribute("data-lazy"); // 저장해놓은 src를 뽑아온 후, 
                img.setAttribute("src",src); //  기존 img src에다 넣어준다.
                img.classList.add("fade"); // css 를 위해 class 변경 
                observer.unobserve(entry.target);
            }
        })
    })
    io.observe(target);
}


images.forEach(lazyLoad);