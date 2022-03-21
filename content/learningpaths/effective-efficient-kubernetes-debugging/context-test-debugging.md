---
 date: '2022-02-23'
 layout: single
 team:
 - David Wu
 - Carlos Nunez
 title: Context test debugging
 weight: 30
 tags:
 - Debugging
 - Kubernetes
---

 In the previous learning path on [a heuristic approach to debugging](../a-heuristic-approach-to-debugging), the top 6 common sources of
 problems were discussed. From these sources, we established how we could exploit 
 these as heuristics to help us in situations where we need to pinpoint where to
 start looking, when faced with a large set of possibilities of where sources a
 problem could occur, or, if we don't have enough information to infer where to
 begin.  One practical aspect of the heuristics approach is that it limits the
 scope of a problem space but, at the same time, it can fail to account for other
 factors in a system, for example, NTP.  Is there a way to avoid this? This
 learning path presents a concept and technique on how we can do this.  

 ## What you will learn

 In this section, you will learn:
 - Context test debugging 
 - The Dump In, Sink Out method for group based problem solving

 ## Refined heuristics with context test debugging

 The most important aspect is the context: Where does one look in a large system?
 It is possible to infer and search for all possible areas described previously.  
 However, sustainable debugging of systems is best served with a good
 understanding of how a system works followed by debugging practice to get
 proficient and efficient.  Understanding how a system works means to understand 
 how the 'engines' run, what are the components involved? True understanding is not
 simply being able to describe it in plain words but to be able to draw it - can
 you draw out the system and data flows?.  Even if the diagram is simple, draw
 it - as this reduces cognitive load while thinking of the problem at hand for
 large complex problems. Some typical diagramming tools can assist, which include,
 [Miro](https://miro.com), [LucidChart](https://www.lucidchart.com) and
 [draw.io](https://app.diagrams.net).  

    One way is to start is top-down, understand the bigger picture and then dive
 into the individual components. On much larger systems, focus on areas of the
 architecture that is relevant to scope of the problem. It is ok to not
 understand everything at once, but importantly, is the mindset of determination
 and curiosity of wanting to know it with an open mind.  Once a picture of the
 system is available, the focus would be on identifying what parts of the system
 are in context to the problem, for example, components that are closely
 related/connected  to where the issue is first seen. Once the context of the
 system is identified, one can start hypothesizing issues
 and prioritizing what issues and tests to perform. Note that it is not necessary
 to hypothesize within the context of the system but it does help limit the
 amount of hypotheses and test that need to be performed to areas that are likely 
 to be the source of an issue. 

 ![A sample visualization](/learningpaths/effective-efficient-kubernetes-debugging/images/debugging-kubernetes-visualization.png)

 From the example diagram above, it can be seen there are number of places where
 an issue may occur. Having a diagram with its data flows on hand, allows
 hypotheses and prioritization of where issues may lie and perform tests at each
 point to see if the hypothesis holds. It is here that the sources of problems
 described in the previous [learning path](../a-heuristic-approach-to-debugging),
 can be assigned as a hypotheses.  Having this picture on hand, one can
 prioritize where to perform our tests, usually starting with components that are
 closely related to where our issue first originated. Always start small and expand
 the scope as needed. 

 ## Group based brainstorming - Dump In, Sink Out

 The previous section looked at forming contexts of a system and hypothesizing where
 issues maybe originating from. For resolving most problems, a single person or a
 pair is sufficient. However, for much larger scale, complex and unknown systems,
 a team of people are best utilized for identifying and solving complex
 problems. This is because experience and different knowledge/perspectives to a
 problem can be gathered and used to form additional hypotheses to tests.
 However, how does one effectively conduct this?  The key to this is using
 brainstorming techniques, such as those discussed
 [here](https://www.mindtools.com/brainstm.html).  This section introduces the
 "Dump In, Sink Out" (DISO) approach, that was utilized and devised by S.
 Wittenkamp and D. Wu for the context of a problem in a very large complex
 software system with a team of developers. This idea is furthered in this
 article by incorporating the concept of the context system diagram.

 The basic requirements for this to work would be that:

 1. all participants have a base knowledge to the problem, for example, knows
 Kubernetes; and 

 2. they should have an understanding or is an expert of the system or any other
 interacting internal or external components; and 

 3. they have access to the system, preferably in pairs. 

 Materials, if done in person, should include sticky notes, painter tape and
 markers. The assumption here is that the facilitator is yourself but you may
 assign this to someone else to conduct. 

 The steps to conducting DISO are as follows:

 1. **Setup**: Before starting and the having the session, a whiteboard should be
 setup as follows:

    ![Setting up DISO](/learningpaths/effective-efficient-kubernetes-debugging/images/debugging-kubernetes-dands-setup.png#center)


 2. **Introductions**: All participants are introduced with in a short statement
 to the scope of the system and the problem encountered, alongside with any
 additional debug information that has been obtained. The goal of the exercise
 should be defined. Once introduced, show a drawing of the system and explain
 what it represents. 

    ![Introducing the problem and goal in DISO](/learningpaths/effective-efficient-kubernetes-debugging/images/debugging-kubernetes-dands-introduction.png#center)

 3. **Hypothesize**: This is the dump in phase. All participants should be
 provided with sticky notes and markers. Participants asked to write down each
 idea on a sticky note and place these on the diagram of the system, in the
 `Hypotheses` area on where/what the problem might be. This should be done alone
 to avoid biases and in a limited time, for example, 10 minutes.  All participants
 should be encouraged to write down any ideas that they might come up with. There
 are no 'bad ideas' and there should be no concern with duplicating ideas
 independent of other participants.

    ![The Dump In phase](/learningpaths/effective-efficient-kubernetes-debugging/images/debugging-kubernetes-dands-hypothesis.png#center)

 4. **Grouping**: Have a facilitator go through each sticky note and asked the
 participant who wrote it to explain the idea and the reason. Move the sticky
 note into the `Grouping & Priority` area.  Ideas that overlap should be grouped
 together. 

    ![Grouping the sticky notes](/learningpaths/effective-efficient-kubernetes-debugging/images/debugging-kubernetes-dands-group.png#center)

 5. **Prioritization**: A facilitator should now look at prioritizing the stick
 notes (or groups of sticky notes), as to which ones are closer to the problem.
 Order these notes from most likely, at the top, to least likely, at the bottom.

    ![Prioritizing the issues to test](/learningpaths/effective-efficient-kubernetes-debugging/images/debugging-kubernetes-dands-prioritize.png#center)

 6. **Testing**: This is the sink out phase.  Each participant, preferably in
 pairs, should each take the prioritize groups of sticky notes, from the top of
 the list and test each hypothesis and move it to the `Tested` area and the
 result. Be sure to document testing methodology. 

    ![The Sink Out phase](/learningpaths/effective-efficient-kubernetes-debugging/images/debugging-kubernetes-dands-testing.png#center)

 Eventually, the above tests should converge to an answer to where or what the
 cause of the problem is.  If there is still no answer, consider what other
 components or system is being interacted with or if there is a bug and seek
 support, for example, IaaS providers and support is required from them if they
 are not part of the current group of participants.