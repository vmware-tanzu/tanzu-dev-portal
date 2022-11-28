---
date: '2021-02-11'
description: 애자일(Agile) 및 DDD(Domain Driven Design) 원칙을 사용하는 일련의 경량 기법으로, 이를 통해 팀은 충분히 소프트웨어 시스템을 현대화할 만큼의 계획을 수립할 수 있습니다.
resources:
- name: cover
  src: images/swift.png
lastmod: '2021-03-04'
length: 포괄적으로 수행하는 경우 2~4일
participants: 비즈니스 이해관계자, 아키텍트, 기술 책임자, 개발자
tags:
- 킥오프
- 검색
- 프레이밍
- 최적화
title: Swift 방식
what:
- 화살표 모양의 접착식 플래그
- 화이트보드 테이프 - 검정색, 초록색, 빨간색 각각 2롤
- 가위
- 스카치 테이프
- 화이트보드 작업대(90cm x 60cm)
- 초강력 접착식 4x6 멀티컬러 스티커 메모, 4팩
when:
- 애플리케이션 현대화 이니셔티브를 반복하는 방식으로 시작합니다. 이는 현재 비즈니스 기능을 신속하게 검토하고 “향후” 아키텍처를 계획하는 간단한 컨설팅 참여가 될 수 있는 [App Navigator](https://tanzu.vmware.com/application-modernization)의 핵심 방법입니다. VMware의 전문가들은 Swift 방법을 실행하여 아키텍처, 경계, 위험이나 우려 지점을 찾아낸 다음 현재 상태에서 미래 상태로 나아갈 방향을 매핑합니다.
why:
- 비즈니스 리더와 기술 담당자의 의견을 조율합니다. 이 접근 방식을 사용하여 시스템을 세분화하고, 시스템이 “동작하기 바라는” 방식과 향후 목표를 매핑하는 개념적인 아키텍처 계획을 개발합니다. VMware는 이렇게 하는 것이 중요한 시스템 현대화에 특히 중요함을 알게 되었습니다. 개발 팀을 조직하는 방법에 관한 결정을 알리고 비즈니스와 기술적인 관점에서 작업의 우선순위를 지정합니다. 현재 상황과 원하는 상태 간의 길을 정의하는 ‘포괄적인’ 방법으로서도 유용합니다.
---

<h2 id="how-to-use-this-method">이 방식을 활용하는
방법</h2>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="sample-agenda--prompts">샘플 안건 및 메시지</h3>

<ol>

<li>

<p>비즈니스 및 기술 인력이 이해하는 언어를 사용하여 시스템을 <a
href="https://tanzu.vmware.com/developer/practices/event-storming">이벤트
스토밍</a>합니다.</p>

</li>

<li>

<p>시스템의 기능 간 관계를 모델링하는 <a
href="https://tanzu.vmware.com/developer/practices/boris">Boris</a>
연습을 수행합니다. Boris 중에 식별된 기술적 기능을 실시간으로 문서화하는 SNAP를 수행합니다.</p>

<p><img
src="https://tanzu.vmware.com/developer/practices/swift-method/images/snap.jpg"
alt="SNAP 분석"  /></p>

</li>

<li>

<p>현대화의 씬 슬라이스를 식별합니다.</p>

<p>씬 슬라이스는 짧은 도메인 이벤트 흐름입니다. 수직 슬라이스는 핵심 도메인에서 짧은 도메인 이벤트 흐름을
선택하고 해당 이벤트를 생성하기 위해 <a
href="https://tanzu.vmware.com/developer/practices/boris">Boris</a>에서
파생된 서비스를 활용하여 식별됩니다. 이러한 이벤트를 생성하는 데 필요한 아키텍처 구성 요소로 생각하면 됩니다. 씬
슬라이스에는 <a
href="https://tanzu.vmware.com/developer/practices/event-storming">이벤트
스토밍</a>, <a
href="https://tanzu.vmware.com/developer/practices/boris">Boris</a>,
SNAP 활동을 통해 정보가 제공됩니다.</p>

<div class="callout td-box--gray-darkest p-3 my-5
border-bottom border-right border-left border-top row"><div
class="col-1 row align-items-center
justify-content-center"><svg height="30"
aria-hidden="true" focusable="false"
data-prefix="far" data-icon="lightbulb"
role="img" xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 352 512" class="svg-inline--fa
fa-lightbulb"><path fill="currentColor"
d="M176 80c-52.94 0-96 43.06-96 96 0 8.84 7.16 16 16 16s16-7.16
16-16c0-35.3 28.72-64 64-64 8.84 0 16-7.16 16-16s-7.16-16-16-16zM96.06
459.17c0 3.15.93 6.22 2.68 8.84l24.51 36.84c2.97 4.46 7.97 7.14 13.32
7.14h78.85c5.36 0 10.36-2.68 13.32-7.14l24.51-36.84c1.74-2.62 2.67-5.7
2.68-8.84l.05-43.18H96.02l.04 43.18zM176 0C73.72 0 0 82.97 0 176c0
44.37 16.45 84.85 43.56 115.78 16.64 18.99 42.74 58.8 52.42
92.16v.06h48v-.12c-.01-4.77-.72-9.51-2.15-14.07-5.59-17.81-22.82-64.77-62.17-109.67-20.54-23.43-31.52-53.15-31.61-84.14-.2-73.64
59.67-128 127.95-128 70.58 0 128 57.42 128 128 0 30.97-11.24
60.85-31.65 84.14-39.11 44.61-56.42 91.47-62.1 109.46a47.507 47.507 0
0 0-2.22 14.3v.1h48v-.05c9.68-33.37 35.78-73.18 52.42-92.16C335.55
260.85 352 220.37 352 176 352 78.8 273.2 0 176 0z"
class=""></path></svg></div><div
class="col-11"><p><strong>팁</strong>:
수직 슬라이스는 아키텍처의 모든 계층을 다루지만, 기능의 일부만을 구현합니다. 예를 들어, “사용자가 암호로 로그인할 수
있도록 허용” 수직 슬라이스는 사용자 인터페이스에 사용자 이름과 암호를 추가하고, 서버 측 논리를 구현하고, 데이터베이스
기록에 최종 로그인 필드를 업데이트할 수 있습니다. 개발자가 가장 익숙하지 않을 수 있는 애플리케이션 내 영역과 상호작용해야
하기 때문에 수직 슬라이싱은 애자일 방식을 처음 접하는 팀이 사고를 전환하기가
어렵습니다.</p></div></div>

</li>

<li>

<p>비즈니스 가치와 기술 리스크, 작업량 간의 균형을 조정하면서 씬 슬라이스의 우선순위를 지정합니다. 목표는
점진적으로 시스템을 “원하는 방식으로” 행동하도록 이동하는 것입니다. 연속적인 각 슬라이스의 구현을 통해 이 목표에 더 가까이
다가갈 수 있습니다.</p>

</li>

<li>

<p>씬 슬라이스는 백로그에서 MVP(최소 기능 제품) 또는 스토리의 컬렉션으로 캡처되었을 때 실행 가능해집니다.
때때로, VMware Tanzu Labs는 고객 팀과의 파트너십을 통해 비즈니스 가치와 기술 리스크, 작업량 간의 균형을
조정하면서 씬 슬라이스를 식별하고 이들의 우선순위를 지정합니다.</p>

<div class="callout td-box--gray-darkest p-3 my-5
border-bottom border-right border-left border-top row"><div
class="col-1 row align-items-center
justify-content-center"><svg height="30"
aria-hidden="true" focusable="false"
data-prefix="far" data-icon="lightbulb"
role="img" xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 352 512" class="svg-inline--fa
fa-lightbulb"><path fill="currentColor"
d="M176 80c-52.94 0-96 43.06-96 96 0 8.84 7.16 16 16 16s16-7.16
16-16c0-35.3 28.72-64 64-64 8.84 0 16-7.16 16-16s-7.16-16-16-16zM96.06
459.17c0 3.15.93 6.22 2.68 8.84l24.51 36.84c2.97 4.46 7.97 7.14 13.32
7.14h78.85c5.36 0 10.36-2.68 13.32-7.14l24.51-36.84c1.74-2.62 2.67-5.7
2.68-8.84l.05-43.18H96.02l.04 43.18zM176 0C73.72 0 0 82.97 0 176c0
44.37 16.45 84.85 43.56 115.78 16.64 18.99 42.74 58.8 52.42
92.16v.06h48v-.12c-.01-4.77-.72-9.51-2.15-14.07-5.59-17.81-22.82-64.77-62.17-109.67-20.54-23.43-31.52-53.15-31.61-84.14-.2-73.64
59.67-128 127.95-128 70.58 0 128 57.42 128 128 0 30.97-11.24
60.85-31.65 84.14-39.11 44.61-56.42 91.47-62.1 109.46a47.507 47.507 0
0 0-2.22 14.3v.1h48v-.05c9.68-33.37 35.78-73.18 52.42-92.16C335.55
260.85 352 220.37 352 176 352 78.8 273.2 0 176 0z"
class=""></path></svg></div><div
class="col-11"><p><strong>팁</strong>:
시스템에 적합한 MVP를 정하기 위해 이러한 도메인이 서로 상호작용하는 포괄적인 수직 씬 슬라이스를 고려해야 합니다. MVP는
<a
href="https://tanzu.vmware.com/content/blog/strangling-a-monolith-by-focusing-on-roi"
target="_blank" rel="nofollow">“모놀리스
제거”</a>와 전술적 패턴의 활용으로부터 경로를 매핑하고 새 도메인 및 서비스와
상호작용합니다.</p></div></div>

</li>

<li>

<p>슬라이스를 정의할 때 신규 또는 제거된 서비스가 이전의 레거시 시스템과 공존할 수 있도록 <a
href="https://docs.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer"
target="_blank">부패 방지 계층</a>, <a
href="https://en.wikipedia.org/wiki/Facade_pattern"
target="_blank">Facade</a>, <a
href="https://www.swiftbird.us/docket-choreography"
target="_blank">Docket 기반 코레오그래피</a>, <a
href="https://martinfowler.com/bliki/StranglerFigApplication.html"
target="_blank">Strangler</a>와 같은 전술적 구현 패턴을
활용하십시오.</p>

</li>

<li>

<p>우선순위로 지정된 사용자 스토리의 백로그를 다시
<em><strong>목표</strong></em>(사례 곧 제공 예정)/OKR에
연결합니다. 사용자 스토리를 MVP 또는 릴리스에 매핑합니다.</p>

<div class="callout td-box--gray-darkest p-3 my-5
border-bottom border-right border-left border-top row"><div
class="col-1 row align-items-center
justify-content-center"><svg height="30"
aria-hidden="true" focusable="false"
data-prefix="far" data-icon="lightbulb"
role="img" xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 352 512" class="svg-inline--fa
fa-lightbulb"><path fill="currentColor"
d="M176 80c-52.94 0-96 43.06-96 96 0 8.84 7.16 16 16 16s16-7.16
16-16c0-35.3 28.72-64 64-64 8.84 0 16-7.16 16-16s-7.16-16-16-16zM96.06
459.17c0 3.15.93 6.22 2.68 8.84l24.51 36.84c2.97 4.46 7.97 7.14 13.32
7.14h78.85c5.36 0 10.36-2.68 13.32-7.14l24.51-36.84c1.74-2.62 2.67-5.7
2.68-8.84l.05-43.18H96.02l.04 43.18zM176 0C73.72 0 0 82.97 0 176c0
44.37 16.45 84.85 43.56 115.78 16.64 18.99 42.74 58.8 52.42
92.16v.06h48v-.12c-.01-4.77-.72-9.51-2.15-14.07-5.59-17.81-22.82-64.77-62.17-109.67-20.54-23.43-31.52-53.15-31.61-84.14-.2-73.64
59.67-128 127.95-128 70.58 0 128 57.42 128 128 0 30.97-11.24
60.85-31.65 84.14-39.11 44.61-56.42 91.47-62.1 109.46a47.507 47.507 0
0 0-2.22 14.3v.1h48v-.05c9.68-33.37 35.78-73.18 52.42-92.16C335.55
260.85 352 220.37 352 176 352 78.8 273.2 0 176 0z"
class=""></path></svg></div><div
class="col-11"><p><strong>팁</strong>:
사용자 스토리 영향 매핑은 스토리를 MVP와 릴리스에 매핑하는 데 적용할 수 있는 기술입니다. DDD와 사용자 스토리 매핑을
결합하는 방법에 관한 <a
href="https://blog.eriksen.com.br/en/mapping-domain-knowledge"
target="_blank">블로그 게시글</a>을 읽어
보십시오.</p></div></div>

</li>

<li>

<p>실습 실험과 피드백, 반복 프로세스를 시작합니다.</p>

</li>

</ol>

</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="successexpected-outcomes">성공/예상되는 성과</h3>

<ul>

<li>현재 시스템 기능을 빠르게 발견하고, 영감을 주는 대상 아키텍처를 생성하고, 우려되는 기반 영역을 파악하고,
우선순위에 대해 합의</li>

<li>개념적 솔루션, 전술적 수정, 잠재적인 절충 사항을 점진적이고 측정된 방식으로 논의 및
이해</li>

<li>가정을 검증/실격 판정하고 솔루션/수정에 정보를 제공하기 위한 아키텍처 작업</li>

<li>점진적으로 서비스를 현대화하는 접근 방식 구축</li>

<li>“모든 것을 테이블에 두는” 접근 방식을 사용하는 관련 비즈니스 성과로 솔루션 정의</li>

<li>작게 시작하여 확장되고 고객 개발자와 아키텍트를 지원하는 전술적 단계 계획을 통해 확신을 향해
전진</li>

</ul>

</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="facilitator-notes--tips">진행자 메모 및 팁</h3>

<p>우수한 진행자는 DDD 관점에서 비즈니스 기능의 지원을 기준으로 시스템을 설계하는 방법을 이끌어내야
합니다.</p>

<p>이 개념적인 아키텍처는 이제 시스템의 우수한 첫 번째 진행 방향을 나타냅니다. 기존 시스템을 현대화하는 툴로
사용될 때 <a
href="https://tanzu.vmware.com/developer/practices/boris">Boris</a>는
가능성 있는 대상 아키텍처를 보여줍니다. Swift 방식의 다른 활동은 현재 상태에서 현대화된 상태로 이동하는 방법을 정의하는
데 도움을 줍니다.</p>

</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="related-practices">관련 사례</h3>

<p>Swift 방식에는 다음을 비롯한 많은 활동이 포함됩니다.</p>

<ul>

<li><a
href="https://tanzu.vmware.com/developer/practices/event-storming">이벤트
스토밍</a></li>

<li><a
href="https://tanzu.vmware.com/developer/practices/boris">Boris</a></li>

</ul>

</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="real-world-examples">실제 예시</h3>

<p>Uber Eats와 같은 유형의 애플리케이션을 위한 현대화의 <a
href="https://tanzu.vmware.com/developer/practices/boris">Boris</a>
및 Swift 방식에 대한 자세한 설명은 <a
href="https://miro.com/app/board/o9J_kzaSk0E=/"
target="_blank">이벤트 스토밍 및 Boris 훈련 Miro 보드</a>를
참조하십시오.</p>

<p><img
src="https://tanzu.vmware.com/developer/practices/swift-method/images/example-1.png"
alt="Swift 방식의 다양한 단계와 서로 간에 흐르는 방식의 시각화"  /></p>

</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="recommended-reading">권장 자료</h3>

<p><a
href="https://tanzu.vmware.com/content/white-papers/tackle-application-modernization-in-days-and-weeks-not-months-and-years"
target="_blank">수개월 혹은 수년이 아닌 며칠 또는 몇 주 만에 애플리케이션 현대화
실현</a>(백서)</p>

<p><a
href="https://www.youtube.com/watch?v=7-fRtd8LUwA"
target="_blank">Swift 방식: 이벤트 스토밍, 거미 같은 Boris와 기타
기술</a>(유튜브 동영상), ExploreDDD 2019에서 Shaun Anderson 진행</p>

<p><a
href="https://www.youtube.com/watch?v=s5qeE4qii6M"
target="_blank">미션 크리티컬 애플리케이션을 클라우드로 이전하기 위한 현대화 패턴 심층
탐구</a>(유튜브 동영상)</p>

<p><a
href="https://tanzu.vmware.com/content/slides/the-modern-family-modernizing-applications-to-pivotal-cloud-foundry-getting-out-of-the-big-ball-of-mud"
target="_blank">기업에서 위협적인 모놀리스 방식을 제거하는 툴</a>(블로그
게시글)</p>

<p><a href="https://www.eventstorming.com/"
target="_blank">EventStorming.com</a>(웹사이트)</p>

</div></div>