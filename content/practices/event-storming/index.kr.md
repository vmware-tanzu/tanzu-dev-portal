---
date: '2021-02-11'
description: 시스템의 도메인, 제한된 컨텍스트 및 서비스에서 벗어나 버티컬 슬라이스, 문제 지점, 시스템 재설계를 위한 시작 지점을 찾아냅니다.
resources:
- name: cover
  src: images/example-2.jpg
lastmod: '2021-03-17'
length: 1~2시간, 여러 번 실행해야 할 수 있음
participants: 비즈니스 이해관계자, 비즈니스 분석가, 임원, 개발자, 아키텍트, 팀 책임자, 도메인 전문가, 핵심 팀
tags:
- 킥오프
- 검색
- 프레이밍
- 최적화
title: 이벤트 스토밍
what:
- 큰 벽 또는 [Miro](https://miro.com/)와 같은 디지털 공동 작업 공간
- 네 가지 색 이상의 스티커 메모
- 네임펜
- 파란색 마스킹 테이프
- 종이 플립 보드(읽기 및 분류용)
when:
- 부서 간 업무 커뮤니케이션을 통해 시스템의 현재 상태를 명확하게 파악해야 하는 경우
- 모놀리식 시스템을 세분화해야 하는 경우
- 시스템에서 가장 큰 제약을 찾아내야 하는 경우
- 시스템의 하위 도메인과 제한된 컨텍스트를 찾아내야 하는 경우
why:
- 이벤트 스토밍은 모놀리스를 마이크로 서비스로 분해할 수 있습니다. 이를 통해 차세대 소프트웨어 시스템에 대한 아이디어를 내기 위해 새 흐름 및 아이디어를 모델링하고, 지식을 종합하고, 충돌 없이 적극적인 그룹 참여를 장려할 수 있습니다.
---

<h2 id="how-to-use-this-method">이 방식을 활용하는
방법</h2>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="sample-agenda--prompts">샘플 안건 및 메시지</h3>

<ol>

<li>

<p>그룹에게 이벤트 스토밍의 목표를 설명합니다. 필요할 경우 아래의 이미지를 보여줍니다. 이벤트, 경계 컨텍스트,
서비스 및 해결 과제에 대한 설명에 포함할 범례를 식별합니다. 모든 스티커 메모에 대한 범례를 그리고 기본적인 DDD(도메인
주도 설계) 용어를 설명합니다.</p>

<p><img
src="https://tanzu.vmware.com/developer/practices/event-storming/images/step-1.png"
alt="게임스토밍 흐름(작성자: Dave Gray)"  /></p>

</li>

<li>

<p>그룹에 대한 “도메인 이벤트”를 정의합니다.</p>

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
class="col-11"><p><strong>예시</strong>:
“&lsquo;도메인 이벤트&rsquo;는 도메인에서의 상태 전환을 나타내며, &lsquo;주문
처리됨&rsquo; 또는 &lsquo;환불 개시됨&rsquo;과 같은 과거 시제의 동사로
표현됩니다.”</p></div></div>

</li>

<li>

<p>도메인 이벤트 하나당 하나씩 일련의 주황색 스티커 메모를 적어 그룹이 “비즈니스 프로세스를 브레인스토밍”하도록
합니다.</p>

<ul>

<li>이벤트 스토밍 세션의 시작과 끝을 식별하여 일련의 이벤트 생성</li>

<li>과거 시제인 이벤트에 대해 생각</li>

<li>먼저 만족스러운 경로부터 시작</li>

<li>스티커 메모를 측면으로 45도 기울여 질문이나 명확히 밝혀야 할 모호함이 있는지 표시</li>

</ul>

<p><img
src="https://tanzu.vmware.com/developer/practices/event-storming/images/example-2.jpg"
alt="샘플 경계 컨텍스트에 둘러싸인 여러 이벤트 스티커 메모"  /></p>

</li>

<li>

<p>벽에 도메인 이벤트를 왼쪽부터 오른쪽으로 시간순으로 배치</p>

</li>

<li>

<p>스토밍 세션을 진행하면서 기존 비즈니스 프로세스의 다양한 측면을 발견하게 됩니다. 다음과 같이 이 측면을
포착합니다.</p>

<ul>

<li><strong>문제 지점</strong>을 빨간색 스티커 메모로
표시</li>

<li>새로운 색상의 스티커 메모로 <strong>외부 시스템</strong>을 강조 표시하고
이들이 트리거하는 작업/이벤트 가까이에 배치</li>

<li>수직 공간을 사용하여 <strong>병렬 처리</strong> 표시</li>

<li><strong>설정된 기간</strong>(배치 프로세스 또는 크론 작업 등)으로 인해
야기되는 모든 사항을 새로운 색상의 스티커 메모로 강조 표시하고 이들이 제어하는 트리거 옆에 배치</li>

</ul>

<p><img
src="https://tanzu.vmware.com/developer/practices/event-storming/images/example-1.png"
alt="Boris용 서비스 노드 입력으로 이어지는 이벤트 스토밍 출력"  /></p>

</li>

<li>

<p>모든 이벤트를 게시한 후에 도메인 전문가와 짝을 지어 국부적으로 순서가 지정된 일련의 이벤트를 게시하고
타임라인을 적용합니다. 진행하면서 피드백을 크라우드소싱합니다.</p>

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
타임라인을 적용하면 오래 기다린 대화가 트리거되며 결과적으로 구조가
형성됩니다.</p></div></div>

<p>크라우드소싱된 피드백으로 놓친 요소를 발견할 수 있습니다. 필요에 따라 스티커 메모를
추가합니다.</p>

</li>

<li>

<p>타임라인을 적용한 상태에서 경계 컨텍스트(즉, “도메인 집합체”)를 찾습니다. 이벤트 그룹을 찾고 이들이
작업을 수행하는 대상이 무엇인지, 그리고 다음 부분으로 전환되는 것이 무엇인지 확인합니다. 하위 도메인 간 전환을 나타내는
중심 이벤트를 파악합니다.</p>

<p>일반적으로 큰 그룹에 더 적은 스티커 메모가 있으며 더 큰 그룹의 스티커 메모는 새로운 경계 컨텍스트로의
전환을 나타냅니다. 경계 컨텍스트 또는 비즈니스 역량을 나타낼 수 있는 수직 스윔레인 이벤트를 찾습니다.</p>

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
경계와 화살표가 있는 선을 그려 모델링 표면의 흐름을 나타냅니다. 경계 컨텍스트에는 실선을 사용합니다. 화살표 머리가 있는
선을 그려 경계 컨텍스트 간의 도메인 이벤트 흐름의 방향을
나타냅니다.</p></div></div>

<p>덜 두드러지게 모델의 경계를 짓고자 한다면 스티커 메모를 사용하여 일반적인 영역을 표시하고 확신을 얻을 때까지
영구 마커로 경계를 그리지 마십시오.</p>

<p>이벤트 스토밍 보드에 표시된 명사의 식별을 크라우드소싱하고 측면에 이를 배치할 수도 있습니다. 이러한 명사를
관련 데이터 트리로 한 덩어리로 묶으면 집합체를 형성하는 데 도움이 됩니다.</p>

</li>

<li>

<p>이러한 이벤트 덩어리 또는 공통 그룹은 개념적 서비스 후보(얼마나 팀이 견고하게 DDD 정의를 수립했는지에
따라 행위자 또는 집합체)를 제공합니다. 이들은 <a
href="https://tanzu.vmware.com/developer/practices/boris">Boris</a>
연습 중에 사용됩니다.</p>

</li>

<li>

<p><strong>선택 사항:</strong> 사용자가 작업을 수행해야 할 다양한 뷰를
식별하고 여러 사용자의 중요한 역할을 파악합니다. 밝은 노란색 스티커 메모를 사용하여 사용자 역할 또는 <a
href="https://tanzu.vmware.com/developer/practices/personas">사용자
유형</a>을 식별합니다. 스티커 메모를 사용하여 사용자 역할, 사용자 유형, 현금 또는 도메인에서 중요한 다른
항목을 점증적으로 표시하여 이벤트 스토밍을 강화합니다.</p>

</li>

<li>

<p>추후에 사용할 수 있는 결과를 포착할 수 있도록 결론을 내리는 시점에 사진을 많이 찍어
두십시오.</p>

</li>

</ol>

</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="successexpected-outcomes">성공/예상되는 성과</h3>

<p>다음을 수행했으면 과정을 완료한 것입니다.</p>

<ul>

<li>경계 컨텍스트 및 이와 연계된 도메인 식별</li>

<li>비즈니스 하위 도메인과 각 경계 컨텍스트 매핑(일반적으로 1대1)</li>

<li>각 경계 컨텍스트/하위 도메인을 대상 아키텍처에서 서비스로 매니페스트화</li>

</ul>

</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="facilitator-notes--tips">진행자 메모 및 팁</h3>

<p><strong>이벤트 스토밍은 모놀리식 애플리케이션의 도메인과 문제 영역을 과학적으로 살펴보는 그룹
연습입니다.</strong> 이벤트 스토밍 프로세스에 대한 가장 간결한 묘사는 <a
href="https://www.oreilly.com/library/view/domain-driven-design-distilled/9780134434964/"
target="_blank" rel="nofollow">Vaughn Vernon의
서적 <em>Domain-Driven Design Distilled</em></a>에 담겨
있으며, <a href="https://www.eventstorming.com/book/"
target="_blank" rel="nofollow">Alberto
Brandolini의 서적 <em>Event Storming</em></a>에서 영감을 받은
프로세스를 중심으로 VMware에서 색상을 개선했습니다.</p>

<p><strong>이벤트 스토밍은 복잡한 시스템과 프로세스를 시각화하는 데 사용되는
기술입니다.</strong> 종류는 모놀리스부터 가치 흐름까지 다양합니다. <a
href="https://gamestorming.com/" target="_blank"
rel="nofollow">게임스토밍</a>에서 영감을 받은 이벤트 스토밍은 그룹의 사고에서
확보한 정보를 활용하고 포착하기 위한 기술입니다. 복잡한 시스템의 충돌과 다양한 관점을 드러내며 최상위 제약과 문제 지점이
노출됩니다. 이벤트 스토밍 진행자에게는 한 가지 임무가 있습니다. 아이디어와 데이터의 교류와 결과물을 위해 안전한 환경을
조성하는 것입니다. 업무의 절반은 기술적 촉진이며 나머지 절반은 신체 언어를 읽는 소프트 인력 촉진입니다.
<strong>한 명의 진행자는 일반적으로 15~20명으로 이루어진 그룹을 조율할 수
있습니다.</strong> 30명 이상의 그룹에는 진행자가 두 명 필요합니다.</p>

<p><strong>이벤트 스토밍은 대개 두 단계로 수행됩니다.</strong> 개략적인
수준의 이벤트 스토밍을 진행하여 도메인을 파악한 다음 최고 제약 사항인 핵심 도메인에 대한 후속 이벤트 스토밍을
진행합니다.</p>

<p><strong>이벤트 스토밍은 스티커 메모로 구현됩니다.</strong> 가장 단순한
형태의 이벤트 스토밍은 일반적으로 그룹 스토리텔링에 의해 촉진됩니다. 스티커 메모는 도메인 이벤트 혹은 과거에 발생한 일을
나타냅니다. 문제 지점은 빨간색 스티커 메모로 식별됩니다. 스티커 메모의 색상은 중요하지 않습니다. 중요한 것은 단순하게
시작하여 점증적으로 표시를 추가하는 것입니다. 단순하게 시작한 다음 정보를 계층적으로 추가하십시오. 이벤트 스토밍은 모놀리스를
해당 구성 요소인 경계 컨텍스트로 세분화하거나 직원을 온보딩하는 수단으로 가치 흐름을 생성하는 등, 여러 목표를 지원할 수
있습니다.</p>

<p><strong>이벤트 스토밍 스타일에 단 하나의 정답은 없습니다.</strong> 원하는
목표와 성과에 따라 모든 세션은 서로 다르기 때문입니다. 따라서 올바르게 수행하지 못한다고 걱정하지 말고 각자의 스타일대로
수행하십시오. 필요한 성과를 실현하려면 다양한 추상화 수준에 대해 이 활동을 여러 번 반복해야 할 수
있습니다.</p>

<p><strong>이벤트 스토밍은 적절한 사람이 참여할 때에만 성공할 수
있습니다.</strong> 이벤트 스토밍은 비즈니스 도메인 전문가, 고객 경영진, 이해관계자, 비즈니스 분석가,
소프트웨어 개발자, 아키텍트, 테스터, 그리고 운영 중인 제품을 지원하는 인력이 함께해야 합니다. 개발자 애플리케이션 도메인을
알고 이해하는 실무 전문가, 제품 담당자가 필요합니다. 이 프로세스를 거치면 팀 전반에서 서로 다른 관점 간에 소통이 가능하며
기술 팀과 그 외 다른 팀원들이 사용하는 용어에 대한 표준 정의를 수립할 수 있습니다.</p>

<p><strong>이벤트 스토밍에 앞서 신데렐라 연습을 진행하는 것이 긴장을 푸는 데 도움이 될 수
있습니다.</strong> 이 연습에서는 신데렐라의 이야기를 지도에 그립니다. PM은 시작과 끝 지점을 선택하고
참가자들에게 영화에서 발생한 사건을 적어 보라고 요청합니다. 이 과정 끝에는 스토리텔링으로 모두가 영화의 내용을 상기하게
됩니다. 이 연습은 팀이 실제로 이벤트 스토밍을 진행하지 않고도 이 연습에 대해 학습할 수 있는 안전한 환경을
제공합니다.</p>

</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="related-practices">관련 사례</h3>

<p>이벤트 스토밍은 <a
href="https://tanzu.vmware.com/developer/practices/swift-method">Swift
방식</a>에 포함된 활동입니다.</p>

<p><a
href="https://tanzu.vmware.com/developer/practices/service-blueprint">서비스
Blueprint</a>는 이와 유사하지만 다릅니다.</p>

<p><a
href="https://tanzu.vmware.com/developer/practices/event-storming/images/event-storming-vs-service-blueprint.png"><img
src="https://tanzu.vmware.com/developer/practices/event-storming/images/event-storming-vs-service-blueprint.png"
alt="이벤트 스토밍과 서비스 Blueprint 비교"  /></a></p>

<p><a
href="https://tanzu.vmware.com/developer/practices/boris">Boris</a>는
종종 이벤트 스토밍을 따릅니다.</p>

</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="real-world-examples">실제 예시</h3>

<p><a
href="https://www.youtube.com/watch?v=by8SdfF56vI"
target="_blank">도메인 주도 설계로 모놀리스 해체</a><br>

<a href="https://miro.com/app/board/o9J_kzaSk0E=/"
target="_blank">모의 WeBeFoods 예시(Miro
사용)</a></div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="recommended-reading">권장 자료</h3>

<p>이벤트 스토밍 연습의 동기:<br>

<a
href="https://www.amazon.com/Gamestorming-Playbook-Innovators-Rulebreakers-Changemakers/dp/0596804172"
target="_blank">Gamestorming: A Playbook for Innovators,
Rulebreakers, and Changemakers</a> - Dave Gray, Sunni Brown,
James Macanufo</p>

<p>어린이용 도서 형식의 이벤트 스토밍에 대한 개괄적인 설명:<br>

<a
href="https://speakerdeck.com/rkelapure/event-storming"
target="_blank">이벤트 스토밍: 어른들을 위한 게임 방식의
설명</a></p>

<p><a
href="https://leanpub.com/introducing_eventstorming"
target="_blank">Event Storming</a> - Alberto
Brandolini(<a href="https://www.eventstorming.com/"
target="_blank">EventStorming.com</a>에서 관련 정보를 찾을 수
있음)</p>

<p>DDD(도메인 주도 설계) - 모놀리스를 분할하는 이론적인 기반을 제공합니다. Vaughn Vernon이
집필한 <a
href="https://www.amazon.com/Domain-Driven-Design-Distilled-Vaughn-Vernon/dp/0134434420"
target="_blank">Domain-Driven Design Distilled</a>는
DDD의 과학과, ES가 여러 사항의 더 큰 계획에 들어맞는 방식, 다시 말해 ES 아티팩트가 소프트웨어 설계, 아키텍처 및
실제 백로그로 전환되는 방식을 이해하는 데 완벽한 책입니다.</p>

</div></div>