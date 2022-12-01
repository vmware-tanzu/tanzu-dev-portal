---
date: '2021-02-11'
description: 복잡한 시스템 내 여러 서비스 간 관계를 파악하여 대상 시스템의 개념적 아키텍처를 밝히고, SNAP를 사용하여 이를 기록합니다.
resources:
- name: cover
  src: images/boris.png
lastmod: '2021-03-17'
length: 실행당 1시간 30분, 통상적으로 여러 번 실행해야 함
participants: '비즈니스 이해관계자, 아키텍트, 기술 책임자, 개발자 '
tags:
- 킥오프
- 검색
- 프레이밍
- 최적화
title: Boris
what:
- 화이트보드 또는 [Miro](https://miro.com/)와 같은 디지털 버전
- 이벤트 스토밍의 결과(제한된 컨텍스트 및 그 안에 포함된 이벤트 목록)
- 화살표 모양의 접착식 플래그
- 화이트보드 테이프(검정색, 초록색, 빨간색 각각 2롤)
- 가위
- 스카치 테이프
- 화이트보드 작업대(90cm x 60cm)
- 초강력 접착식 4x6 멀티컬러 스티커 메모, 4팩
when:
- Boris 연습은 이벤트 스토밍 다음에 수행합니다. 시스템 구성 요소를 확인하고 이러한 구성 요소의 관계를 모델링하기 위해 이벤트 스토밍 활동에서 찾은 통찰력을 사용하기 때문입니다.
why:
- 복잡한 시스템 탐색 및 이해
- 시스템의 기능 간 관계 모델링
- 너무 이른 솔루셔닝 같은 위험 방지
---

<h2 id="how-to-use-this-method">이 방식을 활용하는
방법</h2>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="sample-agenda--prompts">샘플 안건 및 메시지</h3>

<ol>

<li>

<p><a
href="https://tanzu.vmware.com/developer/practices/event-storming">이벤트
스토밍</a>을 진행한 후 한 색상의 스티커 메모를 사용하여 각 경계 컨텍스트를 생성합니다. Blob의 보드에
이들을 배치합니다.</p>

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
경계 컨텍스트, 주제/대기열, 외부 시스템, UI를 식별하는 범례를
생성합니다.</p></div></div>

<p><img
src="https://tanzu.vmware.com/developer/practices/boris/images/legend.jpeg"
alt="스티커 메모가 있는 Boris 범례 예시"  /></p>

</li>

<li>

<p>흐름의 씬 슬라이스를 논의하고 각 경계 컨텍스트가 어떻게 서로 소통하여 흐름을 완성하는지 매핑을 진행합니다.
만족스러운 경로에서 시작하여 만족스럽지 않은 경로로 이동합니다.</p>

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
시스템을 따라 둘 이상의 슬라이스를 매핑할 경우 각각에 대해 서로 다른 색상의 화살표를 사용합니다. 만족스러운 경로라는
측면에서 “to-be(달성 목표)” 경계 컨텍스트는 서로 어떻게 소통해야 합니까? 만족스럽지 않은 경로 관점에서 “to-be”
시스템은 장애 시에 서로 어떻게 소통해야 합니까?</p></div></div>

<p>이벤트 메시지 페이로드를 논의할 경우, 최소한의 고유 키로 가능한 한 가장 작은 메시지를 사용하여 동기 웹
서비스 조회(“린 이벤트, 풍부한 API”)를 통해 고유한 경계 컨텍스트를 식별하도록 권장하십시오.</p>

</li>

<li>

<p>대화를 진행하면서 <strong>동기</strong> 및
<strong>비동기</strong> 의사소통에 서로 다른 색상을 사용하여 시스템 간에 선을 그립니다.
화살표를 추가하여 이들이 푸시하는지 혹은 풀링하는지 표시합니다.</p>

<p>고려해야 할 질문:</p>

<ul>

<li>이 경계 컨텍스트의 입력과 출력은 무엇입니까?</li>

<li>의사소통이 이벤트나 웹 서비스 중 무엇을 통해 이루어져야 합니까?</li>

<li>포함해야 할 교차 통합에는 어떤 것들이 있습니까(예: 알림, 모니터링, 밸런싱, 회계
등)?</li>

</ul>

<p><img
src="https://tanzu.vmware.com/developer/practices/boris/images/step-3.jpg"
alt="Boris 다이어그램 동기 및 비동기 흐름의 예시"  /></p>

</li>

<li>

<p>대기열/주제에 대해 동일한 색상의 새로운 스티커 메모를 추가하여 대기열이 필요한지 여부를 표시합니다.
시스템에서 소통하는 대상에 선을 추가합니다.</p>

</li>

<li>

<p>다른 색상의 새로운 스티커 메모를 사용하여 흐름의 일부인 외부 시스템이 있는지 여부를 표시합니다. 흐름 내의
의사소통 방식에 대한 선을 추가합니다.</p>

</li>

<li>

<p>큰 시트에 SNAP 목록을 작성합니다.</p>

<p>SNAP는 Boris 다이어그램에 대한 이해를 바탕으로 새롭게 제안된 아키텍처 하에서 모든 경계 컨텍스트의
구체적인 요구를 파악합니다. 각 경계 컨텍스트에 대해 SNAP 연습이 수행되어야 하며 API, 필요한 데이터, UI, 해당
경계 컨텍스트에 적용될 리스크를 언급합니다. 제품의 백로그는 식별된 항목을 기반으로 생성됩니다.</p>

<p>고려해야 할 질문:</p>

<ul>

<li>경계 컨텍스트에 대해 어떤 API를 구축해야 합니까?</li>

<li>경계 컨텍스트와 통합할 외부 시스템은 무엇입니까?</li>

<li>경계 컨텍스트에 포함해야 할 데이터 요소는 무엇입니까?</li>

<li>경계 컨텍스트에 대한 UI가 있습니까?</li>

<li>경계 컨텍스트의 주요 리스크는 무엇입니까?</li>

<li>작업을 위한 계정에 대해 생성해야 할 백로그 스토리는 무엇입니까?</li>

<li>Boris 진행 중에 일반적인 대화 속에서 도출되는 사항을 발전시킬 수 있도록 SNAP 시트에 항목을
기록하는 작업을 담당할 사람을 지정하면 도움이 됩니다.</li>

</ul>

<p><img
src="https://tanzu.vmware.com/developer/practices/boris/images/snap.jpg"
alt="주어진 컨텍스트의 SNAP 출력 예시"  /></p>

</li>

<li>

<p>흐름 및 시스템과의 상호작용에 대한 논의를 진행하면서 각 경계 컨텍스트의 시트에 정보를 추가할 수
있습니다.</p>

</li>

<li>

<p>새로운 색상을 사용하여 이를 나타내는 다음 흐름으로 이동합니다.</p>

</li>

<li>

<p>더 큰 경계 컨텍스트 시트에서 새로운 색상의 스티커 메모로 새 흐름에 정보를 추가합니다.</p>

</li>

<li>

<p>경계 컨텍스트 시트에 누락된 특정 영역을 언급합니다.</p>

</li>

</ol>

</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="successexpected-outcomes">성공/예상되는 성과</h3>

<p>Boris 연습의 마무리 시점에서 이르면서 서비스, API, 데이터 및 이벤트 코레오그래피, 작업 백로그가
분명해지기 시작합니다.</p>

<p>SNAP는 실시간으로 Boris의 성과를 빠르게 문서화하는 데 사용됩니다. 정보는 종종 API, 데이터,
Pub/Sub, 외부 시스템/UI, 스토리, 리스크로 그룹화됩니다. 핵심 아티팩트는 회의실 벽 또는 이와 유사한 디지털
워크스페이스에 부착한 포스터 크기의 스티커 종이이며, Boris에 노드 또는 서비스당 하나의 SNAP가 표시됩니다. 일반적으로
Boris에는 노드 혹은 서비스당 하나의 SNAP가 표시됩니다. 각 SNAP는 API, 데이터, 외부 시스템/UI, 외부
시스템/UI, Pub/Sub, 스토리, 리스크라는 6개의 카테고리로 된 문서로 이루어져 있습니다.</p>

</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="facilitator-notes--tips">진행자 메모 및 팁</h3>

<p>Boris, <a
href="https://tanzu.vmware.com/developer/practices/event-storming">이벤트
스토밍</a> 및 기타 기술은 대규모 시스템에서 “실제” 문제를 파악하고 현대화된 시스템의 목표를 향한 방향을
발견하는 데 사용하는 <a
href="https://tanzu.vmware.com/developer/practices/swift-method">Swift
방식</a>의 일부입니다. 수사적인 질문을 통해 솔루션이 자연스럽게 드러나도록 해야 합니다. 솔루션을 견인하는 것과
대상 아키텍처를 조직적으로 발전시키는 것 사이의 균형을 세밀하게 유지하는 과정을 연습하십시오. Boris 연습을 수행할 때
미리 최적화해서는 안 됩니다.</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="challenges-playbook">당면 과제 플레이북</h3>

<p><em><strong>당면 과제: 언제 <a
href="https://tanzu.vmware.com/developer/practices/event-storming">이벤트
스토밍</a>에서 Boris, SNAP로 전환해야 할지 확실하지
않습니다.</strong></em></p>

<p>회의실에서 비즈니스 이벤트를 진행하느라 진행이 느려졌으며 명시적으로 한 라운드 이상의 해결 과제를 지정했을
때, 집합체 경계의 파악을 시도할 수 있습니다. 이 시도가 어려운 것으로 드러날 경우, 한 발 물러서서 여러 정보를 알려줄
이벤트가 더 있는지 살펴볼 수 있습니다.</p>

<p>Boris 및 SNAP는 종종 병렬 구조로 수행됩니다. 이때 SNAP는 Boris 다이어그램을 중심으로
유기적으로 발생하는 대화의 카탈로그를 구축하는 형식으로 이루어집니다.</p>

<p><em><strong>당면 과제: 때때로 <a
href="https://tanzu.vmware.com/developer/practices/event-storming">이벤트
스토밍</a> 세션의 마무리 시점에 명확한 경계 컨텍스트가 없을 수
있습니다.</strong></em></p>

<p>이것은 사안을 너무 자세히(경계 컨텍스트 내에서 하나의 프로세스 또는 프로세스의 일부만 검토) 또는 너무
폭넓게(회사의 전체 또는 대부분을 매핑함) 범위를 살펴보고 있기 때문일 수 있습니다. 이 경우라면 대개 회의실에 있는
참여자에게 질문하여 문제의 범위를 좁힐 수 있습니다. 사안을 지나치게 자세히 살펴보고 있다고 느끼는 경우 두 번째 세션에서 더
많은 관련 이벤트의 이해관계자들과 함께 다시 살펴볼 수 있습니다.</p>

<p><em><strong>당면 과제: 세션을 마쳤는데도 보편적인 언어에 대한 합의에 도달하지
못할 때가 있습니다.</strong></em></p>

<p>경계 컨텍스트의 내부 엔지니어링 및 비즈니스 팀이 용어에 관해 서로 동의한다면 이런 경우에도 문제가 되지 않을
수 있습니다. 여전히 모호함이 존재한다면 모든 명사 및/또는 동사를 수집할 지점을 모색하고 워크샵에 이 과정을 포함시킬 수
있습니다(세션 중에 라운드로 또는 향후 핵심 팀과 함께 전용 세션으로).</p>

<p><em><strong>당면 과제: 회의실에 있는 대부분의 사람이 참여하지 않거나 대화가
한두 명 사이에서만 이루어집니다.</strong></em></p>

<p>사람들에게 노트북이나 휴대폰을 치워 달라고 말합니다. 초기에 참여에 대한 기대치를 설정합니다. 전체 그룹
모빙(mobbing)을 진행하는 과정에서 일부 구성원들의 목소리가 묻히는 경우 대상 청중의 특정 분야를 언급함으로써 그들의
구체적인 관점을 기반으로 <a
href="https://tanzu.vmware.com/developer/practices/event-storming">이벤트
스토밍</a> 또는 Boris 라운드를 수행합니다. 특히 각 사람이 회의실에 있는 이유를 파악하기 위해 준비 작업을
수행했다면 그들 각자에게서 무언가 필요한 것입니다. 이렇게 파악한 이유를 참여하고 있지 않은 동료들에게 특정 유형의 정보를
제공해 달라고 요청하는 데 활용할 수 있습니다.</p>

<p><em><strong>당면 과제: 프로세스의 각 단계에서 우리 모두에게 필요한 사람이
누구인지 알기 어렵습니다.</strong></em></p>

<p>준비 작업 섹션에서 초대할 사람에 관한 설명을 확인하십시오. 실제, 또는 임시적으로 상상한 균형 잡힌 팀과
더불어 이해관계자와 소비자를 대표할 직원을 목표로 하십시오.</p>

<p><em><strong>당면 과제: 조직이 확장함에 따라 세션 진행을 지원할 촉진 경험이
있는 사람을 찾기가 어렵습니다.</strong></em></p>

<p>이는 모든 연습에서 여러 방면으로 사실이므로, 유사한 사례에서 얻은 지혜나 최적화를 여기에 적용할 수
있습니다. 특정 역할을 지니고 있지 않은 누군가가 나타나기를 기다리는 것보다는 준비 단계가 진행자를 찾고 프로세스에서 의도를
띄는 과정이라고 생각하십시오.</p>

<p>또한 “I do, we do, you do(점진적 책임 이양)” 프로세스를 진행하려면 여러 세션을 거쳐야
한다는 사실을 인정하십시오. 더 많은 기회를 촉진하면 이러한 과정을 완화할 수 있습니다.</p>

</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h2
id="related-practices">관련 사례</h2>

<p>Boris는 <a
href="https://tanzu.vmware.com/developer/practices/swift-method">Swift
방식</a>에 포함된 활동입니다.</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3 id="preceding">이전
단계</h3>

<p><a
href="https://tanzu.vmware.com/developer/practices/event-storming">이벤트
스토밍</a></div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="real-world-examples">실제 예시</h3>

<p>Uber Eats와 같은 유형의 애플리케이션을 위한 현대화의 Boris 및 <a
href="https://tanzu.vmware.com/developer/practices/swift-method">Swift
방식</a>에 대한 자세한 설명은 <a
href="https://miro.com/app/board/o9J_kzaSk0E=/"
target="_blank">이벤트 스토밍 및 Boris 훈련 Miro 보드</a>를
참조하십시오.</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="recommended-reading">권장 자료</h3>

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

</div></div>