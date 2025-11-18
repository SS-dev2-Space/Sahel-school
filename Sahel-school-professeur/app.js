(function() {
    'use strict';
    
    // Variables globales
    let supabase;
    let currentUser = null;
    let currentMemberContext = null;
    let effectiveUserId = null;
    let currentPage = 'dashboard';
    let currentDashboardDate = new Date().toISOString().split('T')[0];
    let currentStudentIdForMessages = null;
    
    // Données de l'application
    const appData = {
        classes: [],
        students: [],
        subjects: [],
        grades: [],
        attendance: [],
        absenceJustifications: [],
        studentMessages: [],
        settings: {
            theme: 'light',
            appName: 'Sahel School',
            feries: [],
            attendanceTimes: {
                presentUntil: "07:59",
                lateUntil: "15:00",
                autoAbsentAfter: "15:00"
            }
        }
    };

    // Notification Manager
    const notificationManager = {
        show(message, type = 'info', duration = 3000) {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="flex items-center justify-between">
                    <span>${message}</span>
                    <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                        <i data-lucide="x" class="h-4 w-4"></i>
                    </button>
                </div>
            `;
            document.body.appendChild(notification);
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, duration);
        }
    };

    // Protection contre les doublons
    const duplicateProtection = {
        isAddingGrade: false,
        startGradeAdd() {
            if (this.isAddingGrade) {
                notificationManager.show('⏳ Ajout en cours, veuillez patienter...', 'warning');
                return false;
            }
            this.isAddingGrade = true;
            return true;
        },
        endGradeAdd() {
            this.isAddingGrade = false;
        }
    };

    // Initialisation Supabase
    function initializeSupabase() {
        try {
            const SUPABASE_URL = "https://qsozbohychixzlgpviif.supabase.co";
            const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzb3pib2h5Y2hpeHpsZ3B2aWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTk1ODcsImV4cCI6MjA3ODQ3NTU4N30.gGrrUPqXTsReXHk8p94TvLpqJ_P10t90yTbz4CHWojM";
            
            const supabaseGlobal = (typeof window !== 'undefined' && window.supabase)
                ? window.supabase
                : (typeof supabase !== 'undefined' ? supabase : null);
            
            if (!supabaseGlobal || typeof supabaseGlobal.createClient !== 'function') {
                console.warn('⚠️ Supabase ne s\'est pas chargé');
                return false;
            }
            
            supabase = supabaseGlobal.createClient(SUPABASE_URL, SUPABASE_KEY, {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: false
                }
            });

            supabase.auth.onAuthStateChange((_event, session) => {
                if (_event === 'SIGNED_OUT') {
                    showLogin();
                }
            });

            console.log('✅ Supabase initialisé');
            return true;
        } catch (error) {
            console.error('❌ Erreur Supabase:', error);
            return false;
        }
    }

    // Charger les données
    async function loadMemberContext() {
        if (!currentUser) return;
        
        try {
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .eq('auth_user_id', currentUser.id)
                .single();
            
            if (error && error.code !== 'PGRST116') {
                console.error('Erreur chargement membre:', error);
                return;
            }
            
            if (data) {
                currentMemberContext = data;
                effectiveUserId = data.owner_user_id;
                console.log('✅ Contexte membre chargé:', currentMemberContext.role);
            } else {
                // Pas un membre, vérifier si c'est un admin
                effectiveUserId = currentUser.id;
                currentMemberContext = null;
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    async function loadClassesFromSupabase() {
        if (!effectiveUserId) return;
        try {
            const { data, error } = await supabase
                .from('classes')
                .select('*')
                .eq('user_id', effectiveUserId);
            
            if (error) throw error;
            appData.classes = data || [];
            
            // Filtrer pour les professeurs
            if (currentMemberContext && currentMemberContext.role === 'professeur') {
                const assignedClassIds = new Set(currentMemberContext.assigned_class_ids || []);
                appData.classes = appData.classes.filter(c => assignedClassIds.has(c.id));
            }
        } catch (error) {
            console.error('Erreur chargement classes:', error);
            appData.classes = [];
        }
    }

    async function loadStudentsFromSupabase() {
        if (!effectiveUserId) return;
        try {
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('user_id', effectiveUserId);
            
            if (error) throw error;
            appData.students = data || [];
            
            // Filtrer pour les professeurs
            if (currentMemberContext && currentMemberContext.role === 'professeur') {
                const assignedClassIds = new Set(currentMemberContext.assigned_class_ids || []);
                appData.students = appData.students.filter(s => assignedClassIds.has(s.class_id));
            }
        } catch (error) {
            console.error('Erreur chargement élèves:', error);
            appData.students = [];
        }
    }

    async function loadSubjectsFromSupabase() {
        if (!effectiveUserId) return;
        try {
            const { data, error } = await supabase
                .from('subjects')
                .select('*')
                .eq('user_id', effectiveUserId);
            
            if (error) throw error;
            appData.subjects = data || [];
            
            // Filtrer pour les professeurs
            if (currentMemberContext && currentMemberContext.role === 'professeur') {
                const assignedSubjectIds = new Set(currentMemberContext.assigned_subject_ids || []);
                appData.subjects = appData.subjects.filter(s => assignedSubjectIds.has(s.id));
            }
        } catch (error) {
            console.error('Erreur chargement matières:', error);
            appData.subjects = [];
        }
    }

    async function loadGradesFromSupabase() {
        if (!effectiveUserId) return;
        try {
            const { data, error } = await supabase
                .from('grades')
                .select('*')
                .eq('user_id', effectiveUserId);
            
            if (error) throw error;
            appData.grades = data || [];
        } catch (error) {
            console.error('Erreur chargement notes:', error);
            appData.grades = [];
        }
    }

    async function loadAttendanceFromSupabase() {
        if (!effectiveUserId) return;
        try {
            const { data, error } = await supabase
                .from('attendance')
                .select('*')
                .eq('user_id', effectiveUserId)
                .order('date', { ascending: false })
                .limit(500);
            
            if (error) throw error;
            appData.attendance = data || [];
            
            // Filtrer pour les professeurs
            if (currentMemberContext && currentMemberContext.role === 'professeur') {
                const assignedClassIds = new Set(currentMemberContext.assigned_class_ids || []);
                const allowedStudentIds = new Set(
                    appData.students.filter(s => assignedClassIds.has(s.class_id)).map(s => s.id)
                );
                appData.attendance = appData.attendance.filter(a => allowedStudentIds.has(a.student_id));
            }
        } catch (error) {
            console.error('Erreur chargement présences:', error);
            appData.attendance = [];
        }
    }

    async function loadAllData() {
        try {
            await Promise.all([
                loadClassesFromSupabase(),
                loadStudentsFromSupabase(),
                loadSubjectsFromSupabase(),
                loadGradesFromSupabase(),
                loadAttendanceFromSupabase()
            ]);
            console.log('✅ Toutes les données chargées');
        } catch (error) {
            console.error('Erreur chargement données:', error);
        }
    }

    // Gestion de la session
    async function handleUserSession(session) {
        if (!session || !session.user) {
            showLogin();
            return;
        }

        currentUser = session.user;
        await loadMemberContext();
        
        // Vérifier que c'est bien un professeur
        if (currentMemberContext && currentMemberContext.role !== 'professeur') {
            notificationManager.show('❌ Vous n\'êtes pas autorisé à accéder à cette application', 'error');
            await supabase.auth.signOut();
            return;
        }
        
        await loadAllData();
        showDashboard();
        loadPage('dashboard');
    }

    // Login
    async function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');
        
        showLoginLoading(true);
        errorDiv.classList.add('hidden');
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;
            
            if (data && data.user) {
                await handleUserSession(data);
            }
        } catch (error) {
            console.error('Erreur connexion:', error);
            errorDiv.textContent = error.message || 'Erreur de connexion';
            errorDiv.classList.remove('hidden');
        } finally {
            showLoginLoading(false);
        }
    }

    function showLoginLoading(show) {
        const text = document.getElementById('login-text');
        const loading = document.getElementById('login-loading');
        if (show) {
            text.classList.add('hidden');
            loading.classList.remove('hidden');
        } else {
            text.classList.remove('hidden');
            loading.classList.add('hidden');
        }
    }

    function showLogin() {
        document.getElementById('login-page').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
        currentUser = null;
        currentMemberContext = null;
        effectiveUserId = null;
    }

    function showDashboard() {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        if (currentUser) {
            document.getElementById('user-email').textContent = currentUser.email || '';
        }
    }

    // Navigation
    function loadPage(page) {
        currentPage = page;
        
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('nav-active');
            if (btn.getAttribute('data-page') === page) {
                btn.classList.add('nav-active');
            }
        });

        const content = document.getElementById('page-content');
        content.innerHTML = '<div class="flex items-center justify-center min-h-64"><div class="loading-spinner rounded-full h-8 w-8 border-b-2 border-primary"></div></div>';

        setTimeout(() => {
            switch(page) {
                case 'dashboard':
                    loadDashboardPage();
                    break;
                case 'classes':
                    loadClassesPage();
                    break;
                case 'subjects':
                    loadSubjectsPage();
                    break;
                case 'attendance':
                    loadAttendancePage();
                    break;
                case 'history':
                    loadHistoryPage();
                    break;
                case 'messages':
                    loadMessagesPage();
                    break;
            }
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        }, 150);
    }

    function loadDashboardPage() {
        const selectedDateAttendance = getAttendanceForDate(currentDashboardDate);
        const today = new Date().toISOString().split('T')[0];
        const isToday = currentDashboardDate === today;

        const stats = {
            totalStudents: appData.students.length,
            totalClasses: appData.classes.length,
            present: selectedDateAttendance.filter(a => a.status === 'present').length,
            late: selectedDateAttendance.filter(a => a.status === 'late').length,
            absent: selectedDateAttendance.filter(a => a.status === 'absent').length,
            sick: selectedDateAttendance.filter(a => a.status === 'sick').length
        };

        document.getElementById('page-content').innerHTML = `
            <div class="space-y-6 fade-in">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
                    <p class="text-gray-600">Vue d'ensemble de vos classes</p>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="card">
                        <div class="card-content p-4">
                            <div class="flex items-center space-x-3">
                                <div class="p-2 rounded-full bg-blue-100 text-blue-800">
                                    <i data-lucide="users" class="h-4 w-4"></i>
                                </div>
                                <div>
                                    <p class="text-2xl font-bold">${stats.totalStudents}</p>
                                    <p class="text-sm text-gray-600">Élèves</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-content p-4">
                            <div class="flex items-center space-x-3">
                                <div class="p-2 rounded-full bg-green-100 text-green-800">
                                    <i data-lucide="check-circle" class="h-4 w-4"></i>
                                </div>
                                <div>
                                    <p class="text-2xl font-bold">${stats.present}</p>
                                    <p class="text-sm text-gray-600">Présents</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-content p-4">
                            <div class="flex items-center space-x-3">
                                <div class="p-2 rounded-full bg-yellow-100 text-yellow-800">
                                    <i data-lucide="clock" class="h-4 w-4"></i>
                                </div>
                                <div>
                                    <p class="text-2xl font-bold">${stats.late}</p>
                                    <p class="text-sm text-gray-600">En retard</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-content p-4">
                            <div class="flex items-center space-x-3">
                                <div class="p-2 rounded-full bg-red-100 text-red-800">
                                    <i data-lucide="x-circle" class="h-4 w-4"></i>
                                </div>
                                <div>
                                    <p class="text-2xl font-bold">${stats.absent}</p>
                                    <p class="text-sm text-gray-600">Absents</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2 class="text-xl font-bold">Mes Classes</h2>
                    </div>
                    <div class="card-content">
                        <div class="space-y-3">
                            ${appData.classes.length > 0 ? appData.classes.map(classItem => {
                                const students = appData.students.filter(s => s.class_id === classItem.id);
                                return `
                                    <div class="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <h3 class="font-semibold">${classItem.name}</h3>
                                            <p class="text-sm text-gray-600">${students.length} élève${students.length !== 1 ? 's' : ''}</p>
                                        </div>
                                        <button onclick="loadPage('classes')" class="btn btn-outline btn-sm">
                                            Voir
                                        </button>
                                    </div>
                                `;
                            }).join('') : '<p class="text-center text-gray-500 py-4">Aucune classe assignée</p>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function loadClassesPage() {
        document.getElementById('page-content').innerHTML = `
            <div class="space-y-6 fade-in">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Mes Classes</h1>
                    <p class="text-gray-600">Classes qui vous sont assignées</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${appData.classes.length > 0 ? appData.classes.map(classItem => {
                        const students = appData.students.filter(s => s.class_id === classItem.id);
                        return `
                            <div class="card">
                                <div class="card-header">
                                    <h3 class="text-xl font-bold">${classItem.name}</h3>
                                </div>
                                <div class="card-content">
                                    <p class="text-gray-600 mb-4">${students.length} élève${students.length !== 1 ? 's' : ''}</p>
                                    <button onclick="showClassDetails('${classItem.id}')" class="btn btn-outline w-full btn-sm">
                                        Voir les élèves
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('') : '<div class="col-span-full"><p class="text-center text-gray-500 py-8">Aucune classe assignée</p></div>'}
                </div>
            </div>
        `;
    }

    function showClassDetails(classId) {
        const classItem = appData.classes.find(c => c.id === classId);
        const students = appData.students.filter(s => s.class_id === classId);
        
        document.getElementById('page-content').innerHTML = `
            <div class="space-y-6 fade-in">
                <div class="flex items-center space-x-4">
                    <button onclick="loadPage('classes')" class="btn btn-ghost btn-icon">
                        <i data-lucide="arrow-left" class="h-4 w-4"></i>
                    </button>
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">${classItem?.name || 'Classe'}</h1>
                        <p class="text-gray-600">${students.length} élève${students.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                <div class="card">
                    <div class="card-content">
                        <div class="space-y-2">
                            ${students.map(student => `
                                <div class="flex items-center justify-between p-3 border rounded-lg">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span class="text-sm font-semibold">${student.first_name[0]}${student.last_name[0]}</span>
                                        </div>
                                        <div>
                                            <h3 class="font-semibold">${student.first_name} ${student.last_name}</h3>
                                            <p class="text-sm text-gray-600">Matricule: ${student.matricule || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <button onclick="openStudentMessages('${student.id}')" class="btn btn-outline btn-sm" title="Carnet de liaison">
                                        <i data-lucide="message-square" class="h-4 w-4"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function loadSubjectsPage() {
        document.getElementById('page-content').innerHTML = `
            <div class="space-y-6 fade-in">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Matières et Notes</h1>
                    <p class="text-gray-600">Matières qui vous sont assignées</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${appData.subjects.length > 0 ? appData.subjects.map(subject => {
                        const classItem = appData.classes.find(c => c.id === subject.class_id);
                        const gradesCount = appData.grades.filter(g => g.subject_id === subject.id).length;
                        return `
                            <div class="card">
                                <div class="card-header">
                                    <h3 class="text-xl font-bold">${subject.name}</h3>
                                </div>
                                <div class="card-content">
                                    <p class="text-gray-600 mb-2">${classItem?.name || 'Classe inconnue'}</p>
                                    <p class="text-sm text-gray-500 mb-4">${gradesCount} note${gradesCount !== 1 ? 's' : ''}</p>
                                    <div class="flex space-x-2">
                                        <button onclick="showSubjectGrades('${subject.id}')" class="btn btn-outline w-full btn-sm">
                                            Voir les notes
                                        </button>
                                        <button onclick="showAddGradeModal('${subject.class_id}')" class="btn btn-default w-full btn-sm">
                                            Ajouter note
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('') : '<div class="col-span-full"><p class="text-center text-gray-500 py-8">Aucune matière assignée</p></div>'}
                </div>
            </div>
        `;
    }

    function showSubjectGrades(subjectId) {
        const subject = appData.subjects.find(s => s.id === subjectId);
        if (!subject) return;

        const allGradesForSubject = appData.grades.filter(g => g.subject_id === subjectId);
        const sortedGrades = allGradesForSubject.map(grade => {
            const student = appData.students.find(s => s.id === grade.student_id);
            const scorePercentage = (grade.score / subject.max_score) * 100;
            return { ...grade, student, scorePercentage };
        }).sort((a, b) => b.score - a.score);

        document.getElementById('page-content').innerHTML = `
            <div class="space-y-6 fade-in">
                <div class="flex items-center space-x-4">
                    <button onclick="loadPage('subjects')" class="btn btn-ghost btn-icon">
                        <i data-lucide="arrow-left" class="h-4 w-4"></i>
                    </button>
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Notes de ${subject.name}</h1>
                        <p class="text-gray-600">Max: ${subject.max_score}</p>
                    </div>
                </div>

                <div class="card">
                    <div class="card-content">
                        ${sortedGrades.length > 0 ? `
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-4 py-3 text-left text-xs font-bold uppercase">Élève</th>
                                            <th class="px-4 py-3 text-left text-xs font-bold uppercase">Évaluation</th>
                                            <th class="px-4 py-3 text-center text-xs font-bold uppercase">Note</th>
                                            <th class="px-4 py-3 text-left text-xs font-bold uppercase">Commentaire</th>
                                            <th class="px-4 py-3 text-center text-xs font-bold uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        ${sortedGrades.map(grade => {
                                            const scoreColor = grade.scorePercentage >= 80 ? 'text-green-600' : grade.scorePercentage >= 50 ? 'text-yellow-600' : 'text-red-600';
                                            return `
                                                <tr>
                                                    <td class="px-4 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium">${grade.student?.first_name} ${grade.student?.last_name}</div>
                                                    </td>
                                                    <td class="px-4 py-4 whitespace-nowrap text-sm">${grade.name || 'Note'}</td>
                                                    <td class="px-4 py-4 whitespace-nowrap text-center">
                                                        <div class="text-lg font-bold ${scoreColor}">${grade.score}/${subject.max_score}</div>
                                                        <div class="text-xs ${scoreColor}">${grade.scorePercentage.toFixed(1)}%</div>
                                                    </td>
                                                    <td class="px-4 py-4 text-sm text-gray-500">${grade.comment || '—'}</td>
                                                    <td class="px-4 py-4 whitespace-nowrap text-center">
                                                        <button onclick="showEditGradeModal('${grade.id}')" class="btn btn-ghost btn-sm text-blue-600">
                                                            <i data-lucide="edit" class="h-4 w-4"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        ` : '<p class="text-center text-gray-500 py-8">Aucune note pour cette matière</p>'}
                    </div>
                </div>
            </div>
        `;
    }

    function loadAttendancePage() {
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = getAttendanceForDate(today);

        document.getElementById('page-content').innerHTML = `
            <div class="space-y-6 fade-in">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Présences</h1>
                    <p class="text-gray-600">Présences pour aujourd'hui</p>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="card">
                        <div class="card-content p-4">
                            <div class="flex items-center space-x-3">
                                <div class="p-2 rounded-full bg-green-100 text-green-800">
                                    <i data-lucide="check" class="h-4 w-4"></i>
                                </div>
                                <div>
                                    <p class="text-2xl font-bold">${todayAttendance.filter(a => a.status === 'present').length}</p>
                                    <p class="text-sm text-gray-600">Présents</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-content p-4">
                            <div class="flex items-center space-x-3">
                                <div class="p-2 rounded-full bg-yellow-100 text-yellow-800">
                                    <i data-lucide="clock" class="h-4 w-4"></i>
                                </div>
                                <div>
                                    <p class="text-2xl font-bold">${todayAttendance.filter(a => a.status === 'late').length}</p>
                                    <p class="text-sm text-gray-600">En retard</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-content p-4">
                            <div class="flex items-center space-x-3">
                                <div class="p-2 rounded-full bg-purple-100 text-purple-800">
                                    <i data-lucide="heart" class="h-4 w-4"></i>
                                </div>
                                <div>
                                    <p class="text-2xl font-bold">${todayAttendance.filter(a => a.status === 'sick').length}</p>
                                    <p class="text-sm text-gray-600">Malades</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-content p-4">
                            <div class="flex items-center space-x-3">
                                <div class="p-2 rounded-full bg-red-100 text-red-800">
                                    <i data-lucide="x-circle" class="h-4 w-4"></i>
                                </div>
                                <div>
                                    <p class="text-2xl font-bold">${todayAttendance.filter(a => a.status === 'absent').length}</p>
                                    <p class="text-sm text-gray-600">Absents</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-content">
                        <div class="space-y-2">
                            ${todayAttendance.map(record => {
                                const student = appData.students.find(s => s.id === record.student_id);
                                if (!student) return '';
                                const statusClass = `status-${record.status}`;
                                return `
                                    <div class="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <h3 class="font-semibold">${student.first_name} ${student.last_name}</h3>
                                            <p class="text-sm text-gray-600">${new Date(record.date).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                        <span class="badge ${statusClass}">${getStatusText(record.status)}</span>
                                    </div>
                                `;
                            }).join('')}
                            ${todayAttendance.length === 0 ? '<p class="text-center text-gray-500 py-4">Aucune présence enregistrée aujourd\'hui</p>' : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function loadHistoryPage() {
        const allAttendance = [...appData.attendance].sort((a, b) => new Date(b.date) - new Date(a.date));

        document.getElementById('page-content').innerHTML = `
            <div class="space-y-6 fade-in">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Historique des Présences</h1>
                    <p class="text-gray-600">Historique complet des présences</p>
                </div>

                <div class="card">
                    <div class="card-content">
                        <div class="space-y-3">
                            ${allAttendance.length > 0 ? allAttendance.map(record => {
                                const student = appData.students.find(s => s.id === record.student_id);
                                if (!student) return '';
                                const statusClass = `status-${record.status}`;
                                return `
                                    <div class="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <h3 class="font-semibold">${student.first_name} ${student.last_name}</h3>
                                            <p class="text-sm text-gray-600">
                                                ${new Date(record.date).toLocaleDateString('fr-FR')} • 
                                                ${record.note || 'Aucune note'}
                                            </p>
                                        </div>
                                        <span class="badge ${statusClass}">${getStatusText(record.status)}</span>
                                    </div>
                                `;
                            }).join('') : '<p class="text-center text-gray-500 py-8">Aucun historique</p>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async function loadMessagesPage() {
        document.getElementById('page-content').innerHTML = `
            <div class="space-y-6 fade-in">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Carnet de Liaison</h1>
                    <p class="text-gray-600">Communiquer avec les parents de vos élèves</p>
                </div>

                <div class="card">
                    <div class="card-content">
                        ${appData.students.length > 0 ? `
                            <div class="space-y-2">
                                ${appData.students.map(student => {
                                    const classItem = appData.classes.find(c => c.id === student.class_id);
                                    return `
                                        <div class="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors" onclick="openStudentMessages('${student.id}')">
                                            <div class="flex items-center space-x-3">
                                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                                    ${student.first_name[0]}${student.last_name[0]}
                                                </div>
                                                <div>
                                                    <h3 class="font-semibold">${student.first_name} ${student.last_name}</h3>
                                                    <p class="text-sm text-gray-600">${classItem?.name || 'Classe inconnue'}</p>
                                                </div>
                                            </div>
                                            <i data-lucide="chevron-right" class="h-5 w-5 text-gray-400"></i>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        ` : '<p class="text-center text-gray-500 py-8">Aucun élève assigné</p>'}
                    </div>
                </div>
            </div>
        `;
    }

    async function openStudentMessages(studentId) {
        const student = appData.students.find(s => s.id === studentId);
        if (!student) return;

        currentStudentIdForMessages = studentId;
        document.getElementById('student-messages-title').textContent = `Carnet de Liaison - ${student.first_name} ${student.last_name}`;
        
        await loadStudentMessages(studentId);
        showModal('student-messages-modal');
    }

    async function loadStudentMessages(studentId) {
        const container = document.getElementById('messages-container');
        container.innerHTML = '<p class="text-gray-500 text-center py-4">Chargement des messages...</p>';

        try {
            const { data, error } = await supabase
                .from('student_messages')
                .select('*')
                .eq('student_id', studentId)
                .eq('owner_user_id', effectiveUserId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (data.length === 0) {
                container.innerHTML = '<p class="text-gray-500 text-center py-4">Aucun message pour cet élève.</p>';
                return;
            }

            container.innerHTML = data.map(message => {
                const isMyMessage = message.sender_auth_id === currentUser.id;
                
                return `
                    <div class="flex ${isMyMessage ? 'justify-end' : 'justify-start'}">
                        <div class="p-3 rounded-lg max-w-[80%] ${isMyMessage ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'} shadow-md">
                            <p class="text-sm font-semibold mb-1">${message.sender_name || 'Admin'}</p>
                            <p class="text-sm">${message.content}</p>
                            <p class="text-xs opacity-70 text-right mt-1">
                                ${new Date(message.created_at).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                `;
            }).join('');

            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }

            // Faire défiler jusqu'au dernier message
            container.scrollTop = container.scrollHeight;

        } catch (error) {
            console.error('Erreur chargement messages:', error);
            container.innerHTML = '<p class="text-red-500 text-center py-4">Erreur de chargement des messages.</p>';
        }
    }

    async function handleSendMessage() {
        if (!currentStudentIdForMessages) return;

        const input = document.getElementById('message-input');
        const content = input.value.trim();
        if (content.length === 0) return;

        const sendButton = document.getElementById('send-btn');

        try {
            input.disabled = true;
            if (sendButton) sendButton.disabled = true;

            const messageData = {
                student_id: currentStudentIdForMessages,
                owner_user_id: effectiveUserId,
                sender_auth_id: currentUser.id,
                sender_name: 'Professeur',
                content: content,
                is_read: false
            };

            const { error } = await supabase.from('student_messages').insert([messageData]);
            
            if (error) throw error;

            input.value = '';
            input.disabled = false;
            if (sendButton) sendButton.disabled = false;
            
            await loadStudentMessages(currentStudentIdForMessages);
            notificationManager.show('✅ Message envoyé', 'success');

        } catch (error) {
            input.disabled = false;
            if (sendButton) sendButton.disabled = false;
            console.error('Erreur envoi message:', error);
            notificationManager.show('❌ Erreur lors de l\'envoi', 'error');
        }
    }

    // Utilitaires
    function getAttendanceForDate(date) {
        return appData.attendance.filter(a => a.date === date);
    }

    function getStatusText(status) {
        const statusMap = {
            'present': 'Présent',
            'late': 'En retard',
            'sick': 'Malade',
            'absent': 'Absent',
            'absent_justified': 'Absence justifiée'
        };
        return statusMap[status] || status;
    }

    // Modals
    function showModal(modalId) {
        document.getElementById('modal-overlay').classList.remove('hidden');
        document.getElementById(modalId).classList.remove('hidden');
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
        const anyOtherModalOpen = Array.from(document.querySelectorAll('.dialog-content')).some(modal => !modal.classList.contains('hidden'));
        if (!anyOtherModalOpen) {
            document.getElementById('modal-overlay').classList.add('hidden');
        }
    }

    function showAddGradeModal(classId) {
        document.getElementById('add-grade-class-id').value = classId;
        
        const studentSelect = document.getElementById('grade-student-select');
        const students = appData.students.filter(s => s.class_id === classId);
        studentSelect.innerHTML = '<option value="">Sélectionner un élève</option>' +
            students.map(s => `<option value="${s.id}">${s.first_name} ${s.last_name}</option>`).join('');
        
        const subjectSelect = document.getElementById('grade-subject-select');
        let subjects = appData.subjects.filter(s => s.class_id === classId);
        
        // Filtrer pour ne garder que les matières assignées au professeur
        if (currentMemberContext && currentMemberContext.role === 'professeur') {
            const assignedSubjectIds = new Set(currentMemberContext.assigned_subject_ids || []);
            subjects = subjects.filter(s => assignedSubjectIds.has(s.id));
        }
        
        subjectSelect.innerHTML = '<option value="">Sélectionner une matière</option>' +
            subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
        
        showModal('add-grade-modal');
    }

    async function handleAddGrade(e) {
        e.preventDefault();
        if (!duplicateProtection.startGradeAdd()) return;
        
        const userIdToSave = effectiveUserId;
        if (!userIdToSave) {
            notificationManager.show('❌ Vous devez être connecté.', 'error');
            duplicateProtection.endGradeAdd();
            return;
        }

        try {
            const gradeData = {
                student_id: document.getElementById('grade-student-select').value,
                subject_id: document.getElementById('grade-subject-select').value,
                score: parseFloat(document.getElementById('grade-score').value),
                name: document.getElementById('grade-name').value.trim(),
                comment: document.getElementById('grade-comment').value,
                user_id: userIdToSave
            };

            const { data, error } = await supabase.from('grades').insert([gradeData]).select();
            if (error) throw error;
            
            appData.grades.push(data[0]);
            
            closeModal('add-grade-modal');
            document.getElementById('add-grade-form').reset();
            
            loadPage('subjects');
            notificationManager.show('✅ Note ajoutée avec succès !', 'success');
        } catch (error) {
            console.error('Erreur ajout note:', error);
            notificationManager.show('❌ Erreur lors de l\'ajout de la note: ' + error.message, 'error');
        } finally {
            duplicateProtection.endGradeAdd();
        }
    }

    function showEditGradeModal(gradeId) {
        const grade = appData.grades.find(g => g.id === gradeId);
        if (!grade) return;

        const student = appData.students.find(s => s.id === grade.student_id);
        const subject = appData.subjects.find(s => s.id === grade.subject_id);

        document.getElementById('edit-grade-id').value = grade.id;
        document.getElementById('edit-grade-student-name').textContent = student ? `${student.first_name} ${student.last_name}` : 'Élève inconnu';
        document.getElementById('edit-grade-subject-name').textContent = subject ? subject.name : 'Matière inconnue';
        document.getElementById('edit-grade-score').value = grade.score;
        document.getElementById('edit-grade-comment').value = grade.comment || '';

        showModal('edit-grade-modal');
    }

    async function handleEditGrade(e) {
        e.preventDefault();
        
        if (!currentUser) {
            notificationManager.show('❌ Vous devez être connecté pour modifier une note', 'error');
            return;
        }

        try {
            const gradeId = document.getElementById('edit-grade-id').value;
            
            const gradeData = {
                score: parseFloat(document.getElementById('edit-grade-score').value),
                comment: document.getElementById('edit-grade-comment').value
            };

            const { data, error } = await supabase
                .from('grades')
                .update(gradeData)
                .eq('id', gradeId)
                .eq('user_id', effectiveUserId)
                .select();
            
            if (error) throw error;
            
            const gradeIndex = appData.grades.findIndex(g => g.id === gradeId);
            if (gradeIndex !== -1) {
                appData.grades[gradeIndex] = { ...appData.grades[gradeIndex], ...data[0] };
            }
            
            closeModal('edit-grade-modal');
            loadPage('subjects');
            notificationManager.show('✅ Note modifiée avec succès !', 'success');
        } catch (error) {
            console.error('Erreur modification note:', error);
            notificationManager.show('❌ Erreur lors de la modification de la note: ' + error.message, 'error');
        }
    }

    // Thème
    function toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        appData.settings.theme = newTheme;
        localStorage.setItem('app-settings', JSON.stringify(appData.settings));
        
        const icon = document.querySelector('#theme-toggle i');
        if (icon) {
            icon.setAttribute('data-lucide', newTheme === 'light' ? 'sun' : 'moon');
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        }
    }

    function togglePasswordVisibility(inputId, iconId) {
        const input = document.getElementById(inputId);
        const icon = document.getElementById(iconId);
        if (!input || !icon) return;

        if (input.type === "password") {
            input.type = "text";
            icon.setAttribute('data-lucide', 'eye-off');
        } else {
            input.type = "password";
            icon.setAttribute('data-lucide', 'eye');
        }
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    // Déconnexion
    function handleLogout() {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            performLogout();
        }
    }

    async function performLogout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Erreur déconnexion:', error);
                notificationManager.show('❌ Erreur lors de la déconnexion', 'error');
            }
        } catch (error) {
            console.error('Erreur déconnexion:', error);
            notificationManager.show('❌ Erreur lors de la déconnexion', 'error');
        }
    }

    // Event Listeners
    function setupEventListeners() {
        document.getElementById('login-form').addEventListener('submit', handleLogin);
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
        document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
        
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                loadPage(page);
            });
        });

        document.getElementById('add-grade-form').addEventListener('submit', handleAddGrade);
        document.getElementById('edit-grade-form').addEventListener('submit', handleEditGrade);
    }

    // Initialisation
    document.addEventListener('DOMContentLoaded', async function() {
        console.log('🚀 Initialisation application Professeur...');
        
        if (!initializeSupabase()) {
            return;
        }
        
        setupEventListeners();
        
        // Charger les paramètres
        const saved = localStorage.getItem('app-settings');
        if (saved) {
            const parsedSettings = JSON.parse(saved);
            appData.settings = { ...appData.settings, ...parsedSettings };
        }
        
        const theme = appData.settings.theme || 'light';
        document.body.setAttribute('data-theme', theme);
        
        // Vérifier la session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            await handleUserSession(session);
        } else {
            showLogin();
        }
    });

    // Exposer les fonctions globales
    window.showAddGradeModal = showAddGradeModal;
    window.showEditGradeModal = showEditGradeModal;
    window.showClassDetails = showClassDetails;
    window.showSubjectGrades = showSubjectGrades;
    window.openStudentMessages = openStudentMessages;
    window.handleSendMessage = handleSendMessage;
    window.togglePasswordVisibility = togglePasswordVisibility;
    window.closeModal = closeModal;
    window.loadPage = loadPage;
})();
