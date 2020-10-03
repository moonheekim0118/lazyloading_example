# Lazy loading example

- 이미지 로딩을 지연시키는 것
- 레이지 로딩을 적용시키지 않을 경우 사용자가 웹페이지를 열면 브라우저 내에 있는 모든 이미지를 읽고 불러와서 DOM에 렌더링
- 사용자가 모든 이미지를 다 보고 가지 않는다면 리소스가 낭비 된다.
- 따라서 해당 이미지가 로딩할 필요가 있을 때 이미지를 로딩하는 것


<br/>

## scroll 이벤트를 통한 방법

- scroll 이벤트는 단시간에 수백번 수천번 호출 될 수 있고 동기적으로 실행되므로 메인스레드에 영향을 준다.
- 한 페이지 내 여러 scroll  이벤트가 등록되어 있다면, 이벤트가 끊임없이 호출되어 성능이 저하된다.
- scroll 이벤트 내에서 특정 지점의 위치를 알기 위해서는 getBoundingClientRect() 함수를 사용해야 하는데, 해당 함수는 리플로우(reflow) 현상이 발생한다.
  - 리플로우 현상 : 브라우저가 웹 페이지의 일부 또는 전체를 다시 그려야 하는 경우 

## IntersectionObserver API 사용

- 비동기적으로 실행 되므로 메인스레드에 영향을 주지 않는다. 
- 기본적으로 타겟 엘리먼트가 조상 엘리먼트, 또는 최상위 문서의 뷰포트의 교차영역에서 발생하는 변화를 비동기로 관찰하는 방법을 제공한다. 

<br/>

<img src="demo.gif?raw=true">

<br/>

- ***이미지가 순차적으로 로딩됨을 알 수 있다.***

### 구현

```javascript
const images = document.querySelectorAll('img');

const lazyLoad= (target)=>{ //  img 내 이미지 
    let io = new IntersectionObserver((entries, observer)=>{
        entries.forEach((entry)=>{
            if(entry.isIntersecting){
                const img= entry.target;
                const src =img.getAttribute("data-lazy"); //저장해놓은 이미지소스
                img.setAttribute("src",src); //  기존 img src에다 넣어준다.
                img.classList.add("fade"); // css 를 위해 class 추가  
                observer.unobserve(entry.target); // 관찰 해지 
            }
        })
    })
    io.observe(target); //관찰 대상으로 등록 
}


images.forEach(lazyLoad); // 각각 태그에 함수 적용 
```



1. querySelector로 img 태그 변수를 모두 가져온 후, forEach를 이용해 하나씩 구현해놓은 lazyload 함수를 적용하여 관찰 대상으로 등록한다.
2. 스크롤이 현재 관찰대상의 위치에 있다면, 이미지 태그의 data-lazy attribute 에 넣어놓은 이미지 소스를 가져온 후, 해당 소스를 이미지 태그의 src attributed에 넣어준다.
3. css의 변화를 위해서 (opacity :0 --> opacity:1 ) "fade"클래스도 추가해준다
4. 로딩이 되었다면 해당 이미지 태그를 관찰 대상에서 해지하여, 스크롤이 해당 이미지로 다시 돌아왔을 때 재로딩되지 않게 한다. 



</br>

## CSS background-image 레이지로딩 적용하기



1. CSS 는 class를 이용해서 로딩되었을 때와 로딩되지 않았을 때를 구분해준다.

```css
.container{
    position: absolute;
    background-image: none;
}

.container.visible:nth-child(1){
    background-image: url("./images/background1.png");
    background-repeat: no-repeat;
}
```

<br/>

2. IntersectionObserver에서 해당 영역 위치에 오면, class를 추가해준다.

```javascript
const lazyload=(target)=>{
    let io = new IntersectionObserver((entries, observer)=>{
        entries.forEach((entry)=>{
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        })
    })
    io.observe(target);
}
```




<br/>



#### 참고

[js 레이지 로딩 기법](https://medium.com/@krpeppermint100/js-%EB%A0%88%EC%9D%B4%EC%A7%80-%EB%A1%9C%EB%94%A9-%EA%B8%B0%EB%B2%95-5e3d5dfcb4c1)

[Browser-level image lazy-loading for the web By Houssein Djirdeh](https://web.dev/browser-level-image-lazy-loading/)

[Intersection Observer API 의 사용법과 활용방법 ](http://blog.hyeyoonjung.com/2019/01/09/intersectionobserver-tutorial/)
