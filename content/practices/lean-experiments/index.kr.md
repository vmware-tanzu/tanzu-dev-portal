---
date: '2021-05-10'
description: 제품 실패로 이어질 수 있는 위험한 가정의 유효성이나 무효성을 입증할 수 있도록 팀에서 실행할 실험을 만드는 방법입니다.
resources:
- name: cover
  src: images/lean-experiment-1.png
lastmod: '2021-05-10'
length: 60~90분
linkTitle: 린(Lean) 실험
miro_template_url: ''
participants: 핵심 팀, 이해관계자 (선택 사항)
remote: false
tags:
- 프레이밍
- 인셉션
- 제공
title: 린(Lean) 실험
what:
- 화이트보드 또는 [Miro](https://miro.com/)와 같은 디지털 버전
- 화이트보드용 마커
- 마커
- 종이
- 스티커 메모
- 원형 스티커
- 마스킹 테이프
when:
- D&F 구성 중, 시작 시 또는 제품 개발 중에 이루어집니다. 일반적으로 가정(Assumption) 워크숍은 이미 완료한 상태입니다.
why:
- 린(Lean) 실험은 팀에서 새 제품이나 기능이 의도한 결과를 얻을 수 있다는 증거가 부족할 때 유용합니다. 제품 개발과 함께 린 실험을 수행하면 즉시 운영 가능한 소프트웨어를 개발하고 유지 관리하는 비용 없이 고객/사용자에게 진정으로 가치 있는 것이 무엇인지 검증할 수 있습니다.
---

<h2 id="how-to-use-this-method">이 방식을 활용하는
방법</h2>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="sample-agenda--prompts">샘플 안건 및 메시지</h3>

<ol>

<li>

<p><strong>팀에 린(Lean) 실험 소개</strong></p>

<p>린(Lean) 실험이 무엇이며 수행하는 이유를 설명하고 일반적인 실험 유형을 소개합니다.</p>

<blockquote>

<p><em>“린(Lean) 실험은 극도의 불확실성 조건에서 새로운 제품과 서비스를 만드는 린
스타트업(Lean Startup) 접근 방식을 기반으로 합니다. 린(Lean) 실험은 신속하고 경제적으로 증거를 수집하도록
설계되어 제품에 관한 위험한 가정을 검증하거나 무효화합니다.”</em></p>

</blockquote>

<p><img
src="https://tanzu.vmware.com/developer/practices/lean-experiments/images/lean-experiment-1.png"
alt="검증 없는 리스크"  /></p>

<p>일반적인 실험 유형:</p>

<p><em><strong>A/B
테스트</strong></em></p>

<p>제품 또는 기능의 두 버전을 비교하여 성능이 가장 우수한 버전을 파악합니다. 실험 및 비즈니스 모델의 점진적인
최적화를 위해 사용자가 많은 경우 적합합니다.</p>

<p><em><strong>컨시어지
테스트</strong></em></p>

<p>복잡한 자동화 기술 솔루션을 고객과 직접 상호 작용하는 사람으로 바꾸는 기술입니다. 누구나 제품을 원하는지
여부를 검증하는 데 도움이 됩니다.</p>

<p><em><strong>오즈의 마법사
테스트</strong></em></p>

<p>제품 백엔드를 사람으로 바꾸는 기술입니다. 고객은 자동화 솔루션과 상호 작용하고 있다고 생각합니다. 누구나
제품을 원하는지 여부를 검증하는 데 도움이 됩니다.</p>

<p><em><strong>스모크
테스트</strong></em></p>

<p>일반적으로 제품의 가치 제안을 설명하고 제품 출시 전에 고객에게 제품에 등록하도록 요청하는 웹 사이트입니다.
누구나 제품을 원하는지 여부를 검증하는 데 도움이 됩니다.</p>

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
소개 자료와 예시를 자유롭게 만드십시오. 올바른 방향으로 생각할 수 있도록 추가 예시를 말하십시오. 고유한 제품 영역과 비교할
만한 예시를 찾을 수 있으면 더 좋습니다.</p></div></div>

</li>

<li>

<p><strong>팀의 “맹신” 가정에 대한 카탈로그 작성</strong></p>

<p>팀이 연습 전반에서 참조할 수 있도록 이 용어를 정의와 함께 화이트보드에 추가합니다(가정이 잘못되면 제품이
실패할 가능성이 높음).</p>

<p>2분 동안 스티커 메모에 맹신 가정을 브레인스토밍하도록 팀에 요청합니다. 팀원이 가정을 3개 이상 찾으면 가장
중요한 것으로 스스로 줄여보도록 요청합니다.</p>

<p>화이트보드에 제품의 검증되지 않은 맹신 가정을 작성합니다.</p>

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
부정적인 가정(누구도 낯선 사람의 자동차에 타고 싶지 않음)보다는 긍정적인 가정(사용자가 낯선 사람의 자동차에 타는 것을
안전하다고 느낌)을 만들어 보십시오. 그러면 증거를 얼마나 가지고 있는지 또는 증거가 얼마나 필요한지 생각하기가
쉬워집니다.</p></div></div>

<p>맹신 가정을 두 개 이상 생각해 냈으면 가장 먼저 집중해야 할 가정을 우선순위 1번으로 지정합니다. <a
href="https://tanzu.vmware.com/developer/practices/assumptions">가정</a>
사례를 사용하거나 Y축에 “프로젝트를 중단할 가능성 높음” vs. “프로젝트를 중단할 가능성 낮음”과 X축에 “더 많은 증거
필요” vs. “많은 증거가 있음”의 2x2를 사용해 보십시오. 더 많은 증거가 필요한 프로젝트를 중단할 가능성 높음 가정이
대상입니다.</p>

</li>

<li>

<p><strong>가정을 반증 가능한 가설로 전환해야 함을
설명:</strong></p>

<blockquote>

<p><em><strong>[구체적인 테스트 가능한
작업]</strong></em>으로 <em><strong>[기대하는 측정 가능한
결과]</strong></em> 도출</p>

</blockquote>

<p>가설, 실험 및 측정을 추적하는 데 사용할 형식/템플릿을 소개합니다.</p>

<p>예를 들면 다음과 같습니다.</p>

<ul>

<li><a
href="https://tanzu.vmware.com/developer/files/Lean_Hypothesis_Template_Public.pdf">린(Lean)
실험 템플릿(PDF)</a></li>

<li><a
href="https://assets.strategyzer.com/assets/resources/the-test-card.pdf"
target="_blank" rel="nofollow">Strategyzer 테스트
카드(PDF)</a></li>

</ul>

<p>다음 각각이 나타내는 것을 설명합니다.</p>

<ul>

<li>가설 &mdash; 진실이라고 믿는 것</li>

<li>실험 &mdash; 가설을 검증하기 위해 실행할 테스트</li>

<li>측정 &mdash; 검증을 위해 살펴볼 신호</li>

<li>결과 &mdash; 성공 및 실패 기준</li>

</ul>

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
실험 시간을 제한하는 것을 잊지 마십시오. 실험 실행 시간의 길이를 미리 정의해야
합니다.</p></div></div>

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
팀이 좋은 측정지표를 만드는 것에 익숙하지 않은 경우 기본 지침서나 예시를
제공하십시오.</p></div></div>

</li>

<li>

<p><strong>실험 생성</strong></p>

<p>각 팀원에게 종이 한 장을 나눠 주고 다음과 같이 하도록 지시합니다.</p>

<ul>

<li>가설 및 실험 템플릿 형식 복사</li>

<li>반증 가능한 가설로 맹신 가정 작성</li>

</ul>

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
참가자가 5명 이상인 경우 팀을 나눠 실험을 생성하십시오.</p></div></div>

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
워크숍 전에 템플릿을 인쇄하거나, 팀에 e-메일을 보내 공유하거나, 디지털 워크스페이스에서 제작 및
공유하십시오.</p></div></div>

<p>다음 Miro 보드를 자유롭게 복사하십시오. <a
href="https://miro.com/app/board/o9J_lGThxtc=/"
target="_blank" rel="nofollow">Miro에서 검증
리서치/MVP 실험</a><br>

모든 사람이 5분 동안 개별적으로 가설과 관련 측정 가능한 결과를 테스트하는 실험에 대해 생각해 보도록
합니다.</p>

</li>

<li>

<p><strong>실험 공유</strong></p>

<p>시간이 다 되면, 그룹 토론을 위해 각 팀원(한 명씩)이 벽에 종이를 붙이고 실험 세부 내용을 공유하도록
합니다.</p>

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
class="col-11"><p><strong>팁</strong>: 팀
피드백의 실험 반복이 권장되어야 합니다.</p></div></div>

<p>모두 5분 동안 실험을 공유하도록 합니다.</p>

</li>

<li>

<p><strong>실험 선택</strong></p>

<p>가장 좋은 실험은 최소한의 노력으로 최대한 많은 것을 얻는 것이라고 설명합니다. 팀원에게 가장 잘 실행한
실험에 조용히 점 투표를 하도록 합니다(그룹 규모와 실험 수에 따라 1표 또는 2표).</p>

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
실험이 개선되어야 한다고 생각하는 경우 팀에게 실험을 다시 설계하도록 말하십시오. 여러 팀원을 지정하여 동일한 가설에 대해
$200로 2일, $2,000로 2주, $20,000로 2달이 걸리는 실험을 만드십시오. 실험에 적합한 규모를 찾고 작은
규모로 배우는 방법을 권장하는 데 도움이 됩니다.</p></div></div>

</li>

<li>

<p><strong>실험을 평가하는 방법 논의</strong></p>

<p>실험을 선택하고 평가 방법에 대해 이야기합니다. 일반적으로 실험은 세 가지 학습 결과로 이어지는데 각각에는
예상되는 다음 단계가 있습니다.</p>

<ul>

<li>불확실성 &gt; 추가 테스트 및 실험 반복 가능</li>

<li>검증됨 &gt; 진행</li>

<li>무효화됨 &gt; 회전</li>

</ul>

<p>모든 결과에 대해 실험 결과와 계획된 다음 단계를 기록합니다. Strategyzer의 <a
href="https://assets.strategyzer.com/assets/resources/the-learning-card.pdf"
target="_blank" rel="nofollow">The Learning
Card</a>를 활용하면 좋습니다.</p>

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
실험에 대실패 조건을 설정하는 것은 좋은 방법입니다. 완전히 실패해서 실험 자체가 문제임을 나타낼 수 있습니다. 우리는
무언가를 테스트하기 위해 그것이 진실이라고 믿기 때문에 대실패는 발생할 가능성은
낮습니다.</p></div></div>

</li>

<li>

<p><strong>다음 단계 및 작업 항목 계획</strong></p>

<p>브레인스토밍한 다음 팀원에게 실험을 실행하기 위해 수행할 작업을 할당합니다.</p>

</li>

<li>

<p><strong>실험 추적기 만들기</strong></p>

<p>이 세션에서 선택되지 않았던 백로그의 실험을 계속 추적합니다. 이 실험을 정기적으로 검토하고, 특히 제품
방향이 변경된 경우 관련 실험을 실행하여 제품 방향을 검증합니다.</p>

</li>

</ol>

</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="successexpected-outcomes">성공/예상되는 성과</h3>

<p>전체 팀이 실행할 준비가 된 문서화된 린(Lean) 실험을 조율했으면
성공입니다.</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="facilitator-notes--tips">진행자 메모 및 팁</h3>

<p>검증할 가정이 많은 경우, 위의 마지막 단계에 제시된 것처럼 가정/실험 추적기를 사용한 후속 작업을
고려하십시오. 어떤 가설을 어떤 순서로 테스트해야 하는지 시각화하고 관련 실험을 시각화하는 데 도움이
됩니다.</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="related-practices">관련 사례</h3>

<p><a
href="https://tanzu.vmware.com/developer/practices/assumptions">가정</a></div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3 id="preceding">이전
단계</h3>

<p><a
href="https://tanzu.vmware.com/developer/practices/assumptions">가정</a></div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="real-world-examples">실제 예시</h3>

<p><img
src="https://tanzu.vmware.com/developer/practices/lean-experiments/images/lean-experiment-2.jpg"
alt="린(Lean) 실험 그림"  /></p>

<p><img
src="https://tanzu.vmware.com/developer/practices/lean-experiments/images/lean-experiment-3.jpg"
alt="린(Lean) 실험 그림"  /></p>

</div></div>

<div class="bg-gray-dark p-lg-5 p-3 mb-4"><div
class="col-lg-9"><h3
id="recommended-reading">권장 자료</h3>

<p><a
href="https://www.amazon.com/Lean-Startup-Eric-Ries/dp/B007YXSYTK"
target="_blank" rel="nofollow">Lean
Startup</a>(저자: Eric Ries)</p>

<p><a
href="https://www.amazon.com/Lean-Product-Playbook-Innovate-Products/dp/1118960874/"
target="_blank" rel="nofollow">Lean Product
Playbook</a>(저자: Dan Olsen)</p>

</div></div>