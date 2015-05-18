===================
Demonstration Notes
===================

The point of these demonstrations are to show that PorpoiseFlow and its REST
interface can handle all of the workflow patterns necessary for HIRE 4.0 using
an AJAX client

In order not to distract from this purpose, the demonstrations will have the
following properties:

* The client is a simple AJAX browser client
* The client interacts with the server *only* via RESTful http calls.
* There are only two types of tasks to be performed:

    - A task that logs user input to the console.
    - A task for choosing between transitions.

Setup
=====

1. ``rm db.sqlite3``
2. ``./manage.py migrate``
3. ``./manage.py runserver``

Demonstrations
==============

* :ref:`sequence2`
* :ref:`exclusive-choice-simple-merge2`
* :ref:`multichoice-structured-synchronization2`
* :ref:`parallel-split-synchronization2`
