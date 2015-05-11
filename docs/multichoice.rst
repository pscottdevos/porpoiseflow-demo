.. _multichoice-structured-synchronization:

=========================================
Multi Choice / Structured Synchronization
=========================================

Use Case
========

User makes a definitive choice between multiple branches and only completes
tasks in that branch. When the merge point is reached, flow continues
immediately past the merge point to the next task.

BPMN Diagram
============

.. image:: pics/multichoice.png

Patterns
========

Exclusive Choice Pattern

.. image:: pics/pattern6.png

Structured Synchronization Pattern

.. image:: pics/pattern3.png

Demos
=====

Upper Branch
~~~~~~~~~~~~

* Logging Task 1: First
* Choice 1: A
* Logging Task 2: Middle 
* Logging Task 4: End

Lower Branch
~~~~~~~~~~~~

* Logging Task 1: First
* Choice 1: B
* Logging Task 3: Middle 
* Logging Task 4: End

Both Branches
~~~~~~~~~~~~~

* Logging Task 1: First
* Choice 1: A B
* Logging Task 2: Upper Middle
* Logging Task 3: Lower Middle
* Logging Task 4: End

First Demo
==========

* :ref:`sequence`
