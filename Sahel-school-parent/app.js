(function() {
    'use strict';
    
    // Variables globales
    let supabase;
    let currentUser = null;
    let currentMemberContext = null;
    let effectiveUserId = null;
    let currentPage = 'dashboard';
    let currentStudentId = null;
    
    // Données de l'application
    const appData = {
        students: [],
        classes: [],
        subjects: [],
        grades: [],
        attendance: [],
        studentMessages: [],
        settings: {
            theme: 'light',
            appName: 'Sahel School'
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
                effectiveUserId = currentUser.id;
                currentMemberContext = null;
            }
        } catch (error) {
            console.error('Erreur:', error);
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
            
            // Filtrer pour les parents
            if (currentMemberContext && currentMemberContext.role === 'parent') {
                const assignedStudentIds = new Set(currentMemberContext.assigned_student_ids || []);
                appData.students = (data || []).filter(s => assignedStudentIds.has(s.id));
            } else {
                appData.students = data || [];
            }
        } catch (error) {
            console.error('Erreur chargement élèves:', error);
            appData.students = [];
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
            
            // Filtrer pour ne garder que les classes des enfants assignés
            if (currentMemberContext && currentMemberContext.role === 'parent') {
                const parentClassIds = new Set(appData.students.map(s => s.class_id));
                appData.classes = (data || []).filter(c => parentClassIds.has(c.id));
            } else {
                appData.classes = data || [];
            }
        } catch (error) {
            console.error('Erreur chargement classes:', error);
            appData.classes = [];
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
            
            // Filtrer pour ne garder que les notes des enfants assignés
            if (currentMemberContext && currentMemberContext.role === 'parent') {
                const assignedStudentIds = new Set(currentMemberContext.assigned_student_ids || []);
                appData.grades = (data || []).filter(g => assignedStudentIds.has(g.student_id));
            } else {
                appData.grades = data || [];
            }
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
            
            // Filtrer pour ne garder que les présences des enfants assignés
            if (currentMemberContext && currentMemberContext.role === 'parent') {
                const assignedStudentIds = new Set(currentMemberContext.assigned_student_ids || []);
                appData.attendance = (data || []).filter(a => assignedStudentIds.has(a.student_id));
            } else {
                appData.attendance = data || [];
            }
        } catch (error) {
            console.error('Erreur chargement présences:', error);
            appData.attendance = [];
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
        } catch (error) {
            console.error('Erreur chargement matières:', error);
            appData.subjects = [];
        }
    }

    async function loadStudentMessages(studentId) {
        if (!effectiveUserId || !studentId) return;
        try {
            const { data, error } = await supabase
                .from('student_messages')
                .select('*')
                .eq('student_id', studentId)
                .eq('owner_user_id', effectiveUserId)
                .order('created_at', { ascending: true });
            
            if (error) throw error;
            appData.studentMessages = data || [];
        } catch (error) {
            console.error('Erreur chargement messages:', error);
            appData.studentMessages = [];
        }
    }

    async function loadAllData() {
        try {
            await loadStudentsFromSupabase();
            await Promise.all([
                loadClassesFromSupabase(),
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
        
        // Vérifier que c'est bien un parent
        if (currentMemberContext && currentMemberContext.role !== 'parent') {
            notificationManager.show('❌ Vous n\'êtes pas autorisé à accéder à cette application', 'error');
            await supabase.auth.signOut();
            return;
        }
        
        await loadAllData();
        
        // Sélectionner le premier enfant par défaut
        if (appData.students.length > 0) {
            currentStudentId = appData.students[0].id;
            await loadStudentMessages(currentStudentId);
        }
        
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
                case 'student':
                    loadStudentPage();
                    break;
                case 'grades':
                    loadGradesPage();
                    break;
                case 'attendance':
                    loadAttendancePage();
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
        const selectedStudent = appData.students.find(s => s.id === currentStudentId) || appData.students[0];
        
        if (!selectedStudent) {
            document.getElementById('page-content').innerHTML = `
                <div class="space-y-6 fade-in">
                    <div class="text-center py-12">
                        <i data-lucide="user-x" class="h-16 w-16 text-gray-400 mx-auto mb-4"></i>
                        <h3 class="text-lg font-semibold mb-2">Aucun enfant assigné</h3>
                        <p class="text-gray-600">Contactez l'administration pour obtenir l'accès</p>
                    </div>
                </div>
            `;
            return;
        }

        const studentGrades = appData.grades.filter(g => g.student_id === selectedStudent.id);
        const studentAttendance = appData.attendance.filter(a => a.student_id === selectedStudent.id);
        const classItem = appData.classes.find(c => c.id === selectedStudent.class_id);
        
        // Calculer la moyenne
        let average = 0;
        if (studentGrades.length > 0) {
            let totalScore = 0;
            let totalMaxScore = 0;
            studentGrades.forEach(grade => {
                const subject = appData.subjects.find(s => s.id === grade.subject_id);
                if (subject) {
                    totalScore += grade.score;
                    totalMaxScore += subject.max_score;
                }
            });
            average = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
        }

        document.getElementById('page-content').innerHTML = `
            <div class="space-y-6 fade-in">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
                    <p class="text-gray-600">Informations de votre enfant</p>
                </div>

                ${appData.students.length > 1 ? `
                    <div class="card">
                        <div class="card-content">
                            <label class="text-sm font-medium mb-2 block">Sélectionner un enfant</label>
                            <select id="student-selector" class="select-trigger" onchange="changeStudent(this.value)">
                                ${appData.students.map(s => `
                                    <option value="${s.id}" ${s.id === currentStudentId ? 'selected' : ''}>
                                        ${s.first_name} ${s.last_name}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                ` : ''}

                <div class="card">
                    <div class="card-content">
                        <div class="flex items-center space-x-4">
                            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                                ${selectedStudent.first_name[0]}${selectedStudent.last_name[0]}
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold">${selectedStudent.first_name} ${selectedStudent.last_name}</h2>
                                <p class="text-gray-600">${classItem?.name || 'Classe inconnue'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div class="card">
                        <div class="card-content p-4">
                            <div class="text-center">
                                <p class="text-2xl font-bold">${average.toFixed(1)}%</p>
                                <p class="text-sm text-gray-600">Moyenne</p>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-content p-4">
                            <div class="text-center">
                                <p class="text-2xl font-bold">${studentGrades.length}</p>
                                <p class="text-sm text-gray-600">Notes</p>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-content p-4">
                            <div class="text-center">
                                <p class="text-2xl font-bold">${studentAttendance.length}</p>
                                <p class="text-sm text-gray-600">Présences</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="text-lg font-semibold">Informations Personnelles</h3>
                    </div>
                    <div class="card-content space-y-3">
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p class="text-gray-600">Né le</p>
                                <p class="font-medium">${new Date(selectedStudent.birth_date).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div>
                                <p class="text-gray-600">à</p>
                                <p class="font-medium">${selectedStudent.birth_place || 'N/A'}</p>
                            </div>
                            <div>
                                <p class="text-gray-600">Matricule</p>
                                <p class="font-medium">${selectedStudent.matricule || 'N/A'}</p>
                            </div>
                            <div>
                                <p class="text-gray-600">École</p>
                                <p class="font-medium">${selectedStudent.school || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function loadStudentPage() {
        const selectedStudent = appData.students.find(s => s.id === currentStudentId) || appData.students[0];
        if (!selectedStudent) {
            loadDashboardPage();
            return;
        }

        const classItem = appData.classes.find(c => c.id === selectedStudent.class_id);

        document.getElementById('page-content').innerHTML = `
            <div class="space-y-6 fade-in">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Profil de l'Élève</h1>
                    <p class="text-gray-600">Informations détaillées</p>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="text-lg font-semibold">Informations Personnelles</h3>
                    </div>
                    <div class="card-content space-y-4">
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p class="text-gray-600">Nom</p>
                                <p class="font-medium">${selectedStudent.last_name}</p>
                            </div>
                            <div>
                                <p class="text-gray-600">Prénom</p>
                                <p class="font-medium">${selectedStudent.first_name}</p>
                            </div>
                            <div>
                                <p class="text-gray-600">Date de naissance</p>
                                <p class="font-medium">${new Date(selectedStudent.birth_date).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div>
                                <p class="text-gray-600">Lieu de naissance</p>
                                <p class="font-medium">${selectedStudent.birth_place || 'N/A'}</p>
                            </div>
                            <div>
                                <p class="text-gray-600">Matricule</p>
                                <p class="font-medium">${selectedStudent.matricule || 'N/A'}</p>
                            </div>
                            <div>
                                <p class="text-gray-600">Classe</p>
                                <p class="font-medium">${classItem?.name || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function loadGradesPage() {
        const selectedStudent = appData.students.find(s => s.id === currentStudentId) || appData.students[0];
        if (!selectedStudent) {
            loadDashboardPage();
            return;
        }

        const studentGrades = appData.grades.filter(g => g.student_id === selectedStudent.id);

        document.getElementById('page-content').innerHTML = `
            <div class="space-y-6 fade-in">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Notes</h1>
                    <p class="text-gray-600">Notes de ${selectedStudent.first_name} ${selectedStudent.last_name}</p>
                </div>

                <div class="card">
                    <div class="card-content">
                        ${studentGrades.length > 0 ? `
                            <div class="space-y-4">
                                ${studentGrades.map(grade => {
                                    const subject = appData.subjects.find(s => s.id === grade.subject_id);
                                    const maxScore = subject ? subject.max_score : 20;
                                    const percentage = (grade.score / maxScore * 100).toFixed(1);
                                    return `
                                        <div class="border rounded-lg p-4">
                                            <div class="flex justify-between items-start mb-2">
                                                <div class="flex-1">
                                                    <h4 class="font-semibold text-lg">${grade.name || subject?.name || 'Note'}</h4>
                                                    <p class="text-sm font-medium text-blue-600">${subject?.name || 'Matière inconnue'}</p>
                                                    <p class="text-sm text-gray-600 mt-1">${grade.comment || 'Aucun commentaire'}</p>
                                                </div>
                                                <div class="text-right ml-4">
                                                    <div class="text-xl font-bold">${grade.score}/${maxScore}</div>
                                                    <div class="text-sm ${percentage >= 80 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'} font-medium">${percentage}%</div>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        ` : '<p class="text-center text-gray-500 py-8">Aucune note disponible</p>'}
                    </div>
                </div>
            </div>
        `;
    }

    function loadAttendancePage() {
        const selectedStudent = appData.students.find(s => s.id === currentStudentId) || appData.students[0];
        if (!selectedStudent) {
            loadDashboardPage();
            return;
        }

        const studentAttendance = [...appData.attendance]
            .filter(a => a.student_id === selectedStudent.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        document.getElementById('page-content').innerHTML = `
            <div class="space-y-6 fade-in">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Présences</h1>
                    <p class="text-gray-600">Historique de présence de ${selectedStudent.first_name} ${selectedStudent.last_name}</p>
                </div>

                <div class="card">
                    <div class="card-content">
                        ${studentAttendance.length > 0 ? `
                            <div class="space-y-2">
                                ${studentAttendance.map(record => {
                                    const statusClass = `status-${record.status}`;
                                    return `
                                        <div class="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <h3 class="font-semibold">${new Date(record.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                                                <p class="text-sm text-gray-600">${record.note || 'Aucune note'}</p>
                                            </div>
                                            <span class="badge ${statusClass}">${getStatusText(record.status)}</span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        ` : '<p class="text-center text-gray-500 py-8">Aucune présence enregistrée</p>'}
                    </div>
                </div>
            </div>
        `;
    }

    async function loadMessagesPage() {
        const selectedStudent = appData.students.find(s => s.id === currentStudentId) || appData.students[0];
        if (!selectedStudent) {
            loadDashboardPage();
            return;
        }

        await loadStudentMessages(selectedStudent.id);

        document.getElementById('page-content').innerHTML = `
            <div class="space-y-6 fade-in">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Carnet de Liaison</h1>
                    <p class="text-gray-600">Communication avec l'administration</p>
                </div>

                <div class="card">
                    <div class="card-content">
                        <div id="messages-container" class="max-h-96 overflow-y-auto mb-4 p-2 border rounded-lg bg-gray-50 scroll-touch space-y-3">
                            ${appData.studentMessages.length > 0 ? appData.studentMessages.map(message => {
                                const isMyMessage = message.sender_auth_id === currentUser.id;
                                return `
                                    <div class="flex ${isMyMessage ? 'justify-end' : 'justify-start'}">
                                        <div class="p-3 rounded-lg max-w-[80%] ${isMyMessage ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}">
                                            <p class="text-xs ${isMyMessage ? 'text-blue-100' : 'text-gray-500'} mb-1">${message.sender_name || 'Admin'}</p>
                                            <p>${message.content}</p>
                                            <p class="text-xs ${isMyMessage ? 'text-blue-100' : 'text-gray-500'} mt-1">
                                                ${new Date(message.created_at).toLocaleString('fr-FR')}
                                            </p>
                                        </div>
                                    </div>
                                `;
                            }).join('') : '<p class="text-center text-gray-500 py-4">Aucun message</p>'}
                        </div>
                        
                        <div class="flex space-x-2">
                            <input 
                                type="text" 
                                id="message-input" 
                                class="input flex-1" 
                                placeholder="Écrire un message..."
                            >
                            <button onclick="sendMessage()" class="btn btn-default btn-icon">
                                <i data-lucide="send" class="h-4 w-4"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async function sendMessage() {
        const selectedStudent = appData.students.find(s => s.id === currentStudentId);
        if (!selectedStudent) return;

        const input = document.getElementById('message-input');
        const content = input.value.trim();
        if (content.length === 0) return;

        try {
            const messageData = {
                student_id: selectedStudent.id,
                owner_user_id: effectiveUserId,
                sender_auth_id: currentUser.id,
                sender_name: 'Parent',
                content: content,
                is_read: false
            };

            const { error } = await supabase.from('student_messages').insert([messageData]);
            if (error) throw error;

            input.value = '';
            await loadStudentMessages(selectedStudent.id);
            loadPage('messages');
            notificationManager.show('✅ Message envoyé', 'success');
        } catch (error) {
            console.error('Erreur envoi message:', error);
            notificationManager.show('❌ Erreur lors de l\'envoi', 'error');
        }
    }

    async function changeStudent(studentId) {
        currentStudentId = studentId;
        await loadStudentMessages(studentId);
        loadPage(currentPage);
    }

    // Utilitaires
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
    function closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
        const anyOtherModalOpen = Array.from(document.querySelectorAll('.dialog-content')).some(modal => !modal.classList.contains('hidden'));
        if (!anyOtherModalOpen) {
            document.getElementById('modal-overlay').classList.add('hidden');
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

        // Enter key pour envoyer un message
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && document.getElementById('message-input') && document.getElementById('message-input') === document.activeElement) {
                sendMessage();
            }
        });
    }

    // Initialisation
    document.addEventListener('DOMContentLoaded', async function() {
        console.log('🚀 Initialisation application Parent...');
        
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
    window.changeStudent = changeStudent;
    window.sendMessage = sendMessage;
    window.togglePasswordVisibility = togglePasswordVisibility;
    window.closeModal = closeModal;
    window.loadPage = loadPage;
})();
