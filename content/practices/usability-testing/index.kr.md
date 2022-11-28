---
title: 사용 편의성 테스트
linkTitle: 사용 편의성 테스트
description: 디자인이 직관적인지 확인하는 방법으로, 기존 디자인의 주요 문제를 파악하고, 개선할 기회를 찾고, 대상 사용자 동작에 대해 자세히 알아볼 수 있습니다.
# Note: remove any tags that are not relevant.
tags: ["검색"]
length: 45분~1시간
participants: 핵심 팀, 실무 전문가
# custom "cover" image example: "boris/boris.png"
image: "cover-image.png" 
lastmod: "2022-04-15"
date: "2022-04-15"
why: 
- 사용성 테스트를 통한 디자인 검증은 사용자와 이들의 요구에 영향을 미칠 수 있는 사용자 중심 디자인을 수립하는 데 도움이 됩니다. 사용자에게 가치를 창출하기 위해서는 사용자에게 맞는 방식으로 문제를 해결하고 있는지 확인해야 합니다. 이 세션은 사용성 테스트를 수행하기 전에 팀을 조정하기 위한 모범 사례에 대한 개요를 제공합니다.
when:
- 프로젝트 초기 연구의 중요성을 고려해 사용성 테스트는 일반적으로 초기에 이루어지며, 기능 또는 흐름을 개발하기 전에 디자인의 유효성을 검사하려는 경우에 이루어지기도 합니다. 사용자가 적절히 테스트할 수 있도록 디자인되고 제작된 프로토타입이 있어야 합니다.
what:
- Invision 또는 Figma와 같은 프로토타이핑 툴

# If this practice or workshop has a Miro template: remote: true
remote: false
miro_template_url: "URL for related Miro template" 

---
<h2 id="how-to-use-this-method">이 방식을 활용하는
방법</h2>

<h3 id="assumptions">가정:</h3>

<ul>

<li>테스트하려는 기능이 설계되었으며 프로토타입으로 바뀌었습니다.</li>

<li>대면 또는 화상 회의로 진행되는 사용 편의성 테스트 세션의 대상 사용자 5명을 이미 모집하고
스케줄링했습니다.</li>

<li>진행자 1명과 회의록 작성자 1명이 있습니다.</li>

<li>진행자와 회의록 작성자는 동일인일 수 없습니다.</li>

</ul>

<h3 id="sample-agenda--prompts">샘플 안건 및 메시지</h3>

<ol>

<li>

<p>소개(5~10분)</p>

<ul>

<li>사용자에게 녹화 관련 동의를 요청합니다.</li>

<li>사용자에게 일반적인 정보를 요청합니다.

<ul>

<li>이름(예: “성함이 어떻게 되십니까?”)</li>

<li>나이(예: “나이가 어떻게 되십니까?”)</li>

<li>직업(예: “직업이 무엇입니까?”)</li>

</ul>

</li>

<li>테스트와 관련된 기타 데이터(예: “이전에 음식 배달 애플리케이션을 사용해 본 적이
있으십니까?”)</li>

<li>테스트 대상자에게 테스트 중이 아니며 같은 편이라고 말하여 안심시킵니다. 다음 반복 과정에서 설계가 개선될
수 있도록 진심 어린 피드백의 가치를 상기시킵니다.</li>

<li>사용 편의성 테스트를 진행하면서 테스트 대상자가 자신의 생각, 행동, 의견을 밝히도록 격려합니다.

<ul>

<li>도와주는 사람 없이 애플리케이션과 처음 상호 작용하는 사람을 모방하고자 하므로 끝날 때까지 질문에 답변할 수
없음을 알립니다.</li>

</ul>

</li>

<li>사용자가 테스트를 진행하기 전에 질문할 수 있도록 합니다.</li>

</ul>

</li>

<li>

<p>작업(25~30분)</p>

<p>사용자에게 각 작업을 제공하고, 각자에게 적합한 방식으로 작업을 수행하려는 동안 지켜봅니다.</p>

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
class="col-11"><p><p>현실성 있고 실행 가능한 작업을
제공하십시오.</p>

<p>편견을 방지하기 위해, 설계에서 제시된 대로 작업을 완료하는 방법에 관한 힌트를 사용자에게 제공하지
마십시오.</p>

</p></div></div>

</li>

<li>

<p>질문과 끝맺는 말로 마무리합니다(5~10분). 다음과 같은 질문을 생각해 볼 수 있습니다.</p>

<ul>

<li>방금 진행한 이 프로세스에 대해 어떻게 생각하십니까?</li>

<li>일반적으로 사용하는 툴과 비교해서 방금 경험한 툴은 어떠했습니까?</li>

<li>덧붙이고 싶은 사항이 있으십니까?</li>

</ul>

</li>

<li>

<p>리서치 결과를 종합합니다(사용 편의성 테스트를 모두 수행한 후).</p>

<ul>

<li>사용자 피드백과 작업 전반에서 추세를 파악합니다.</li>

<li>통과/실패 표를 만들어 설계상 효과적인 부분과 그렇지 않은 부분을 빠르게 확인합니다.</li>

<li>이해관계자에게 보다 개괄적으로 결과를 발표하는 경우 프레젠테이션으로 만들어 결과를
시각화합니다.</li>

</ul>

</li>

</ol>

<h2 id="successexpected-outcomes">성공/예상되는
성과</h2>

<p>사용 편의성 테스트에서 수집한 결과를 통해 현재 진행하고 있는 반복 작업에 따라 설계를 효과적으로 조정하고
개발을 시작할 자신감을 얻었다면 성공한 것입니다.</p>

<h2 id="facilitator-notes--tips">진행자 메모 및 팁</h2>

<p>스크립트 팁: 사용 편의성 테스트를 진행하기 전에 소개, 작업, 마무리 질문을 포함해 스크립트를 작성해
보십시오. 그러면 회의록 작성자가 템플릿을 사용해 더 쉽게 기록할 수 있고 팀은 테스트를 모두 수행한 후 종합할 수
있습니다.</p>

<p>또한 진행자는 일관된 형식을 사용하여 각 세션 간을 원활하게 전환할 수 있습니다. 이를 통해 진행자는 주어진
시간을 더 효율적으로 활용할 수 있습니다.</p>

<h2 id="recommended-reading">권장 자료</h2>

<p>사용 편의성 테스트 사례를 효과적으로 숙지하려면 Nielsen Norman Group에서 게시한 다음 게시글을
읽어보시기 바랍니다.</p>

<ul>

<li><a
href="https://www.nngroup.com/articles/usability-testing-101/"
target="_blank" rel="nofollow">Usability
Testing 101</a></li>

<li><a
href="https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/"
target="_blank" rel="nofollow">Why you Only
Need to Test with 5 Users</a></li>

<li><a
href="https://www.nngroup.com/articles/how-many-test-users/"
target="_blank" rel="nofollow">How Many Test
Users</a></li>

<li><a
href="https://www.nngroup.com/articles/thinking-aloud-the-1-usability-tool/"
target="_blank" rel="nofollow">Thinking Aloud:
The #1 Usability Tool</a></li>

</ul>