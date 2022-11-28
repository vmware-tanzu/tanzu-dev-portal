---
title: 사후 분석
linkTitle: 사후 분석
description: 제품이나 사용자에게 영향을 미치는 인시던트로부터 교훈을 얻는 연습입니다. SRE 커뮤니티에서는 이 연습을 인시던트 회고라고 합니다.
tags: ["제공"]
length: 1시간
participants: "핵심 제공 팀, 이해관계자, and support team"
lastmod: "2021-07-28"
date: "2021-07-28"
why: 
- Postmortems help to reduce the recurrence of negative incidents
when:
- When the team agrees that there is something to learn about the incident or near miss
- During the incident or soon after it is resolved, as long as the session would not interfere with resolving the incident
- Stakeholders or another team (e.g. support team) has asked for a postmortem session

what:
- 화이트보드 또는 [Miro](https://miro.com/)와 같은 디지털 버전
- 스티커 메모
- 마스킹 테이프
- 네임펜

remote: false
miro_template_url: "" 

---
<h2 id="how-to-use-this-method">이 방식을 활용하는
방법</h2>

<p>먼저 인시던트를 정의하겠습니다.</p>

<ul>

<li>라이브 제품에서 사용자와 제품 간 상호 작용을 중단하는 이벤트</li>

<li>개발 프로세스에 큰 영향을 미치는 예기치 못한 부정적인 이벤트</li>

<li><a
href="https://cloud.google.com/blog/products/management-tools/sre-error-budgets-and-maintenance-windows"
target="_blank" rel="nofollow">오류
예산</a> 위반</li>

</ul>

<h3 id="sample-agenda--prompts">샘플 안건 및
메시지</h3>

<ol>

<li>

<p><strong>세션 전에</strong> 인시던트에 관한 정보를 최대한 많이
수집합니다. 예를 들어 관련 팀에 정보를 요청하는 설문조사를 보낼 수 있습니다. 팀에서 진행 중인 인시던트에 관해 메모한
경우 해당 메모도 수집합니다.</p>

<p>또한 세션 전에 타임라인을 만든 다음 사후 분석 세션을 진행하는 동안 검증하면
유용합니다.</p>

<p>타임라인 예시:</p>

<p><img
src="https://tanzu.vmware.com/developer/practices/postmortem/images/timeline.jpg"
alt="사후 분석 타임라인"  /></p>

<p>사후 분석 세션에 적합한 사람들을 초대하십시오. 예를 들면 다음과 같습니다.</p>

<ul>

<li>핵심 팀: 제품 관리자, 엔지니어, 디자이너</li>

<li>관련 당사자로, 주요 역할을 수행하며 인시던트와 관련된 사람 예를 들면 다음과 같습니다.

<ul>

<li>플랫폼 팀 구성원</li>

<li>보안 팀 구성원</li>

</ul>

</li>

</ul>

</li>

<li>

<p><strong>사후 분석의 목표 설명(5분)</strong></p>

<p>다음과 같이 말할 수 있습니다.</p>

<blockquote>

<p>“최근 인시던트의 원인은 무엇입니까? 어떻게 해결하셨습니까? 향후 이런 인시던트를 방지하기 위한 작업
항목을 정의하고 사후 분석 문서에 문서화하려고 합니다. 비난받을 사람을 찾으려는 것이 아닙니다.”</p>

</blockquote>

<div class="callout td-box--gray-darkest p-3 my-5
border-bottom border-right border-left border-top
row"><div class="col-1 row align-items-center
justify-content-center"><svg height="30"
aria-hidden="true" focusable="false"
data-prefix="far" data-icon="lightbulb"
role="img" xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 352 512" class="svg-inline--fa
fa-lightbulb"><path fill="currentColor"
d="M176 80c-52.94 0-96 43.06-96 96 0 8.84 7.16 16 16 16s16-7.16
16-16c0-35.3 28.72-64 64-64 8.84 0 16-7.16
16-16s-7.16-16-16-16zM96.06 459.17c0 3.15.93 6.22 2.68 8.84l24.51
36.84c2.97 4.46 7.97 7.14 13.32 7.14h78.85c5.36 0 10.36-2.68
13.32-7.14l24.51-36.84c1.74-2.62 2.67-5.7
2.68-8.84l.05-43.18H96.02l.04 43.18zM176 0C73.72 0 0 82.97 0 176c0
44.37 16.45 84.85 43.56 115.78 16.64 18.99 42.74 58.8 52.42
92.16v.06h48v-.12c-.01-4.77-.72-9.51-2.15-14.07-5.59-17.81-22.82-64.77-62.17-109.67-20.54-23.43-31.52-53.15-31.61-84.14-.2-73.64
59.67-128 127.95-128 70.58 0 128 57.42 128 128 0 30.97-11.24
60.85-31.65 84.14-39.11 44.61-56.42 91.47-62.1 109.46a47.507 47.507
0 0 0-2.22 14.3v.1h48v-.05c9.68-33.37 35.78-73.18 52.42-92.16C335.55
260.85 352 220.37 352 176 352 78.8 273.2 0 176 0z"
class=""></path></svg></div><div
class="col-11"><p><strong>팁</strong>:
어떤 일이 발생했으며 향후 이러한 일이 일어나지 않도록 방지하기 위한 방법을 확인하고자 하므로 비난하지 않는 문화를
포용하십시오. 각 팀원이 심리적으로 편안하도록 하십시오.</p></div></div>

</li>

<li>

<p><strong>인시던트 타임라인 제시(5분)</strong></p>

<p>인시던트 타임라인을 표시하고 팀과 함께 확인합니다.</p>

</li>

<li>

<p><strong>사후 분석 주제 브레인스토밍(5분)</strong></p>

<p>팀에게 스티커 메모 또는 디지털 워크스페이스에 다음을 작성하도록 요청합니다.</p>

<ul>

<li>잘못된 사항 - 최근 인시던트의 원인은 무엇입니까?</li>

<li>효과적인 사항 - 인시던트를 해결하는 데 효과적이었던 작업은 무엇입니까?</li>

<li>운이 좋았던 경우 - 도움이 된 이벤트/항목이 있습니까?</li>

</ul>

</li>

<li>

<p><strong>빠른 주제 클러스터링(5분)</strong></p>

<p>팀에게 비슷한 주제를 기반으로 스티커 메모를 클러스터링하도록 요청합니다.</p>

</li>

<li>

<p><strong>각 클러스터 논의(20분)</strong></p>

<p>각 클러스터에 대해 논의할 시간을 충분히 줍니다. 특정 클러스터에 시간이 더 필요한 경우 해당 주제에 관한
후속 세션을 고려해 보십시오.</p>

<p>“잘못된 사항” 열에 있는 클러스터의 경우, “왜 이런 일이 발생했습니까?”와 “이런 일이 다시 발생하는
경우 어떻게 해야 영향을 줄일 수 있습니까?”도 질문합니다.</p>

<div class="callout td-box--gray-darkest p-3 my-5
border-bottom border-right border-left border-top
row"><div class="col-1 row align-items-center
justify-content-center"><svg height="30"
aria-hidden="true" focusable="false"
data-prefix="far" data-icon="lightbulb"
role="img" xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 352 512" class="svg-inline--fa
fa-lightbulb"><path fill="currentColor"
d="M176 80c-52.94 0-96 43.06-96 96 0 8.84 7.16 16 16 16s16-7.16
16-16c0-35.3 28.72-64 64-64 8.84 0 16-7.16
16-16s-7.16-16-16-16zM96.06 459.17c0 3.15.93 6.22 2.68 8.84l24.51
36.84c2.97 4.46 7.97 7.14 13.32 7.14h78.85c5.36 0 10.36-2.68
13.32-7.14l24.51-36.84c1.74-2.62 2.67-5.7
2.68-8.84l.05-43.18H96.02l.04 43.18zM176 0C73.72 0 0 82.97 0 176c0
44.37 16.45 84.85 43.56 115.78 16.64 18.99 42.74 58.8 52.42
92.16v.06h48v-.12c-.01-4.77-.72-9.51-2.15-14.07-5.59-17.81-22.82-64.77-62.17-109.67-20.54-23.43-31.52-53.15-31.61-84.14-.2-73.64
59.67-128 127.95-128 70.58 0 128 57.42 128 128 0 30.97-11.24
60.85-31.65 84.14-39.11 44.61-56.42 91.47-62.1 109.46a47.507 47.507
0 0 0-2.22 14.3v.1h48v-.05c9.68-33.37 35.78-73.18 52.42-92.16C335.55
260.85 352 220.37 352 176 352 78.8 273.2 0 176 0z"
class=""></path></svg></div><div
class="col-11"><p><strong>팁</strong>:
<a href="https://en.wikipedia.org/wiki/Five_whys">“5
Whys” 방법</a>을 사용해 보십시오. 개인을 비난하지 말고 프로세스로 인한 근본 원인에
집중하십시오.</p></div></div>

</li>

<li>

<p><strong>작업 항목 논의(15분)</strong></p>

<p>인시던트를 해결하고 향후에 발생하지 않도록 방지하기 위해 수행할 수 있는 작업은 무엇인지 팀과 논의합니다.
이러한 작업의 소유자를 정의합니다.</p>

</li>

<li>

<p><strong>사후 분석 소유자 관련 합의(4분)</strong></p>

<p>팀으로서 다음과 같은 책임을 담당하는 사후 분석 소유자를 결정합니다.</p>

<ul>

<li>향후 참조를 위해 다음을 포함하는 사후 분석 문서 작성

<ul>

<li>인시던트 개요</li>

<li>인시던트를 해결하기 위한 작업 항목</li>

<li><a
href="https://asq.org/quality-resources/root-cause-analysis"
target="_blank" rel="nofollow">근본 원인
분석</a></li>

<li>교훈 및 향후 인시던트 발생을 방지하기 위한 다음 단계</li>

</ul>

</li>

<li>사후 분석 상태에 관하여 이해관계자와 커뮤니케이션</li>

<li>사후 분석 회의의 모든 작업 항목이 수행되었는지 확인하기 위한 검토 회의 계획</li>

</ul>

</li>

<li>

<p><strong>후속 작업 스케줄링(1분)</strong></p>

<p>작업을 검토하기 위해 후속 사후 분석 세션에 대해 팀과 합의합니다. 팀이 모든 사후 분석 작업을 완료할
때까지 인시던트를 종결해서는 안 됩니다.</p>

</li>

</ol>

<h2 id="successexpected-outcomes">성공/예상되는
성과</h2>

<p>이 활동이 끝나면 팀은 인시던트가 무엇이었으며 어떻게 발생했는지 명확하게 이해할 수 있습니다. 또한 팀은
인시던트 재발을 방지하거나 그 영향을 줄이는 계획을 수립했을 것입니다.</p>

<h2 id="facilitator-notes--tips">진행자 메모 및
팁</h2>

<p>사후 분석 문서 예시:</p>

<ul>

<li>Google의 사후 분석 예시: <a
href="https://sre.google/sre-book/example-postmortem/"
target="_blank" rel="nofollow">Shakespeare
Sonnet++ Postmortem</a></li>

<li><a href="https://github.com/dastergon"
target="_blank"
rel="nofollow">@dastergon</a>의 <a
href="https://github.com/dastergon/postmortem-templates"
target="_blank" rel="nofollow">사후 분석
템플릿</a></li>

<li>의</li>

<li><a href="https://github.com/google/sredocs"
target="_blank" rel="nofollow">Google GitHub의
“sredocs”</a></li>

</ul>

<h2 id="recommended-reading">권장 자료</h2>

<p><a
href="https://www.atlassian.com/incident-management"
target="_blank" rel="nofollow">Atlassian
Incident management</a></p>

<p><a
href="https://sre.google/sre-book/postmortem-culture/"
target="_blank" rel="nofollow">Google
Postmortem culture</a></p>

<p>책: Life of a production system incident(출간 예정)</p>