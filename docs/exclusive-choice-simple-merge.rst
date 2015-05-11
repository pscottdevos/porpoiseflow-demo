.. _exclusive-choice-simple-merge:

===============================
Exclusive Choice / Simple Merge
===============================

Use Case
========

User makes a definitive choice between multiple branches and only completes
tasks in that branch. When the merge point is reached, flow continues
immediately past the merge point to the next task.

BPMN Diagram
============

.. image:: pics/exclusive-choice-simple-merge.png

Patterns
========

Exclusive Choice Pattern

.. image:: pics/pattern4.png

Simple Merge Pattern

.. image:: pics/pattern5.png

Demos
=====

Setup
~~~~~

* ``./manage.py run_demo user1 exclusive_choice_simple_merge``

Procedure
~~~~~~~~~
Upper Branch
------------

* Logging Task 1: First
* Choice 1: A
* Logging Task 2: Middle 
* Logging Task 4: End
* y

Lower Branch
------------

* Logging Task 1: First
* Choice 1: B
* Logging Task 3: Middle 
* Logging Task 4: End
* y

Can't Do Both Branches
----------------------

* Logging Task 1: First
* Choice 1: A B
* Logging Task 2: Middle 
* Logging Task 4: End
* n

Next Demo
=========

* :ref:`multichoice-structured-synchronization`
