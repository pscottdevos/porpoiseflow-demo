.. PorpoiseFlow Demo documentation master file, created by
   sphinx-quickstart on Thu May  7 09:24:16 2015.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

.. ===================
.. Flow-Jam Objectives
.. ===================

.. ----------------------------
.. or "How to Make Steve Happy"
.. ----------------------------

.. toctree::

    demo
    demo2


Overview
========

Steve's Demo Expectations
~~~~~~~~~~~~~~~~~~~~~~~~~

Demo Format
-----------

    1. Describe the Use Case to be demonstrated
    2. Show the BPMN diagram that represents the demonstration
    3. Identify the pattern that will be demonstrated
    4. Run the demo

Patterns
--------

    1. Sequence

        .. image:: pics/pattern1.png

    2. Parellel Split

        .. image:: pics/pattern2.png

    3. Synchronization

        .. image:: pics/pattern3.png

    4. Exclusive Choice

        .. image:: pics/pattern4.png

    5. Simple Merge

        .. image:: pics/pattern5.png

    6. Multi-choice

        .. image:: pics/pattern6.png


Plan of Attack
~~~~~~~~~~~~~~

    1. Create a set of BPMN diagrams that demonstrate the six patterns

    2. Create a text-only application

        * Probably use an admin command
        * Command drives the RESTful interface of the demo app

    3. Create two types of tasks

        * A task that takes input and logs it
        * A task that takes input and uses it to match transitions

    4. Write a script for the demo

BPMN Diagrams
=============

How Porpoiseflow uses BPMN diagrams
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    * Pools
    * Lanes

        - Users
        - Groups

    * Start Events
    * Tasks
    * Exclusive Gateways
    * Parallel Gateways

        - Halting Flow
        - Use of Documentation field

    * Subprocesses
    * End Events
    * Extensions

        - ":" properites (class names)
        - "." properties (field names and values)

Create diagrams for each of the six "Workflow Patterns"
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    1. Sequence
    2. Parellel Split
    3. Synchronization
    4. Exclusive Choice
    5. Simple Merge
    6. Multi-choice


Application
===========

Suggested Application Design
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    * Simple urls.py to share the api
    * Client is management command
    * Input taken from command line and posted to RESTful Iterface


Building the Pieces
~~~~~~~~~~~~~~~~~~~

Server
------
    * Loading diagrams
    * Instantiating and starting a process

        - View
        - urls.py

    * Developing Tasks

        - A task that takes input and logs it
        - A task that takes input and uses it to match transitions

Client
------
    * Client Process Loop and the REST Framework

        - Calling for next node
        - Task Nodes

            + Retrieving Task
            + User input
            + POSTing 

        - Parallel Gateway Nodes
